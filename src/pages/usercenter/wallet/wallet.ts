import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { BankcardPage } from '../wallet/bankcard/bankcard';
import { WithdrawalPage } from '../wallet/withdrawal/withdrawal';
import {　BankcardlistPage }　from '../wallet/bankcard/bankcardlist/bankcardlist';

import { WalletSeviceProvider } from '../../../providers/wallet-sevice/wallet-sevice'
import { ErrorUtils } from '../../../utils/error.utils';
import { SigninPage } from '../../login/signin/signin';
import { MessageServiceProvider } from '../../../providers/message-service/message-service';

var walletHttpList;
@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage implements OnInit {
  token: string;
  customerId: string;
  balance: string = "0";
  authenticationStatus: number; //0-未认证 1-认证中 2-认证成功 3-认证失败
  withdraws: any;//提取
  rebate: any;//折扣
  rebateHidden: boolean;
  withdrawalHidden: boolean;
  readStatus: number;
  messageId: any;
  customerToken: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtr: AlertController,
    public messageService: MessageServiceProvider,
    public walletService: WalletSeviceProvider
  ) {
    this.token = localStorage.getItem("token");
    this.customerId = localStorage.getItem("customerId");
    this.messageId = this.navParams.get("messageId");
    this.readStatus = this.navParams.get("readStatus");
    this.customerToken = localStorage.getItem("customerToken");
  }
  pet: string = "rebate";

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

  ngOnInit() {
    this.getWithdrawCashAndRebateHttp();
  }

  ionViewWillEnter() {
    var that = this;
    if( that.readStatus == 0 ) {
      that.messageService.readMessage(that.customerToken, that.messageId).subscribe(res => {

      },error => {
        ErrorUtils.handleError(error, that.alerCtr, that.navCtrl, SigninPage)
      })
    }


  }

  //显示交易记录及金额 http 请求
  getWithdrawCashAndRebateHttp() {
    this.walletService.getdrawCashAndRebate(this.token, this.customerId).subscribe(res => {
      console.log("钱包首页：" + res);
      if (res.errorCode == 0) {
        walletHttpList = res.data;
        if (walletHttpList.balance) {
          this.balance = walletHttpList.balance;
        } else {
          this.balance = "0";
        }

        this.authenticationStatus = walletHttpList.authenticationStatus;
        this.withdraws = walletHttpList.withdraws;
        this.rebate = walletHttpList.rebate;
        if (this.rebate > 0) {
          this.rebateHidden = true;
          for (let rebateItem of this.rebate) {
            rebateItem.rebateCreaeTime = formatDate(rebateItem.creattTime);
          }
        } else {
          this.rebateHidden = false;
        }
        if (this.withdraws.transactionDTOs.length > 0) {
          this.withdrawalHidden = true;
        } else {
          this.withdrawalHidden = false;
        }
      }
    }, error => {
      ErrorUtils.handleError(error, this.alerCtr, this.navCtrl, SigninPage)
    })
  }

  //跳转提现
  Withdrawal() {
    let bankAlertCtrl = this.alerCtr.create({
      title: '提示',
      message: '身份认证',
      buttons: [{
        text: '取消'
      }, {
        text: '去认证',
        handler: () => {
          this.navCtrl.push(BankcardPage);
        }
      }]
    });
    if (this.authenticationStatus == 0 || this.authenticationStatus == 3 || !this.authenticationStatus || this.authenticationStatus == 1) {
      bankAlertCtrl.present();
    } else {
      this.navCtrl.push(WithdrawalPage, {
        balance: this.balance,
      });
    }
  }

  //跳转银行卡
  Bankcard() {
    console.log("跳转一行卡"+ this.authenticationStatus);
    let bankAlertCtrl = this.alerCtr.create({
      title: '提示',
      message: '身份验证中。。。',
      buttons: ['好的']
    });
    if ( this.authenticationStatus == 0 || this.authenticationStatus == 3 || !this.authenticationStatus ) {
      this.navCtrl.push(BankcardPage);
    } else if(this.authenticationStatus == 2 ){
      this.navCtrl.push(BankcardlistPage, {
        typeBton: 0
      });
    } else if ( this.authenticationStatus == 1 ) {
      bankAlertCtrl.present();
    }
  }


}


function formatDate(d) {
  var now = new Date(d);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = addZero(now.getHours());
  var minute = addZero(now.getMinutes());
  var second = addZero(now.getSeconds());
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function addZero(d) {
  return d < 10 ? '0' + d : d;
} 

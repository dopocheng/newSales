import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { ErrorUtils } from '../../utils/error.utils';
import { SigninPage } from '../login/signin/signin';
import { UnpaidOrderServiceProvider } from '../../providers/unpaid-order-service/unpaid-order-service';

@IonicPage()
@Component({
  selector: 'page-unpaidorder',
  templateUrl: 'unpaidorder.html',
})
export class UnpaidorderPage implements OnInit{
  
  tabBarElement: any;//获取 tabbar 节点 
  readStatus: number;//
  customerToken: string;//客户 token
  messageId: any;//
  pet: string = "";//手机平台类型
  unPaidOrder: any;//未支付订单
  customerId: any;//客户Id
  paidOrder: any[];//已支付订单
  token: string;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public messageservice: MessageServiceProvider,
              public alerCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public orderService: UnpaidOrderServiceProvider
  ) {
    this.pet = navParams.get('orderType');
    console.log("orderType" + this.pet);
    this.readStatus = navParams.get("readStstus");
    this.customerToken = localStorage.getItem("customerToken");
  }

  ionViewWillEnter() {
    // 隐藏底部 tabBar 
    this.tabBarElement = document.querySelector('.tabbar');
    if(this.tabBarElement) {
      this.tabBarElement.style.display = 'none';
      
    }

    var that = this;
    if(that.readStatus == 0) {//?
      that.messageservice.readMessage(that.customerToken, that.messageId).subscribe(res => {

      },error => {
        ErrorUtils.handleError(error, that.alerCtrl, that.navCtrl, SigninPage)
      });
    }
  }

  ngOnInit () {

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    var that = this;
    that.token = localStorage.getItem("token");
    that.customerToken = localStorage.getItem("customerToken");
    that.customerId = localStorage.getItem("customerId");
    setTimeout(function () {
      if (that.pet === "待支付订单") {
        //获取未支付订单数据
        that.orderService.getUnpaidAllOrderList(that.customerId, that.customerToken).subscribe(res => {
          that.unPaidOrder = res.data;
          //console.log("待支付订单", that.unPaidOrder);
          var tempArr = [];
          for(let one of that.unPaidOrder){
            if(one.type !=3){
              tempArr.push(one)
            }
          }
          that.unPaidOrder = tempArr;

        },error =>{
          ErrorUtils.handleError(error,this.alerCtrl,this.navCtrl,SigninPage)
        });
      } else if (that.pet != "待支付订单") {
        //获取已支付订单数据
        that.orderService.getUnpaidAllOrderList(that.customerId, that.customerToken).subscribe(res => {

          if(that.pet === "待晒单"){
            var tempArr = [] ;
            for(let one of res.data){
              if(one.needEvaluate ==true){
                tempArr.push(one)
              }
            }
            that.paidOrder = tempArr
          }
          else {
            that.paidOrder = res.data;
          }

          //console.log("已支付订单", that.paidOrder);
        },error =>{
          ErrorUtils.handleError(error,this.alerCtrl,this.navCtrl,SigninPage)
        });
      }
      loading.dismiss();
    }, 300);
  }

}

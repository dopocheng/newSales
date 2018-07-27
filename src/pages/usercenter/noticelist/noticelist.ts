import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { MessageServiceProvider } from '../../../providers/message-service/message-service'
import { ErrorUtils } from '../../../utils/error.utils';
import { SigninPage } from '../../login/signin/signin';
import { MessagelistPage } from '../noticelist/messagelist/messagelist'

@IonicPage()
@Component({
  selector: 'page-noticelist',
  templateUrl: 'noticelist.html',
})
export class NoticelistPage implements OnInit{
  token: string;
  customerId: string;
  count0: number;//邀请未读消息数
  count1: number;//推广未读消息数
  count2: number;//我的资产未读消息数

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public messageService: MessageServiceProvider,
              public alerCtrl: AlertController
  ) {
  }

  ngOnInit() {
    var that = this;
    that.token = localStorage.getItem("token");
    that.customerId = localStorage.getItem("customerId");
  }

  ionViewWillEnter() {
    var that = this;
    that.messageService.getUnreadMessages(that.token, that.customerId).subscribe(res => {
      console.error("获取通知列表");
      console.info(res);
      if(res && res.errorCode == 0) {
        var data = res.data;
        if(data) {
          that.count0 = data.type0;
          that.count1 = data.type1;
          that.count2 = data.type2;
        }
      }
    }, error => {
      ErrorUtils.handleError(error, this.alerCtrl, this.navCtrl, SigninPage)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticelistPage');
  }

  gotoMessages(type) {
    this.navCtrl.push(MessagelistPage, {messageType: type});
  }



}

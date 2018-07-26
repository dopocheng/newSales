import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageServiceProvider } from '../../../providers/message-service/message-service'

@IonicPage()
@Component({
  selector: 'page-noticelist',
  templateUrl: 'noticelist.html',
})
export class NoticelistPage implements OnInit{
  token: string;
  customerId: string;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public messageService: MessageServiceProvider
  ) {
  }

  ngOnInit() {
    var that = this;
    that.token = localStorage.getItem("token");
    that.customerId = localStorage.getItem("customerId");
  }

  ionViewWillEnter() {
    var that = this;
    that.messageService.getUnreadMessages(that.token, that.customerId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticelistPage');
  }



}

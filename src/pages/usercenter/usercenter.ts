import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AppConfig } from '../../app/app.config';
import { SigninPage } from '../login/signin/signin';
import { CustomerServiceProvider } from '../../providers/customer-service/customer-service';
import { UserinfoServiceProvider } from '../../providers/userinfo-service/userinfo-service';
import { ErrorUtils } from '../../utils/error.utils';

/**
 * Generated class for the UsercenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usercenter',
  templateUrl: 'usercenter.html',
})
export class UserCenterPage implements OnInit {

  token: string;//token
  siteId: string;//位置
  avatarUrl: string = "../assets/images/defaultAv.png";//个人中心 background
  customerId: any;//顾客id
  customerToken: string;//顾客token
  customer: any;//客户
  recordId: any;//记录
  activityDrawTime:number = 0;//幸运时间
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public customerService: CustomerServiceProvider,
    public userinfoService: UserinfoServiceProvider,
    public alerCtrl: AlertController
  ) {
  }
  
  ngOnInit(): void {
   
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UsercenterPage');
  }

  // 即将进入页面，登录后重新获取客户信息
  ionViewWillEnter() {
    this.token = localStorage.getItem("token");
    this.customerId = localStorage.getItem("customerId");
    this.siteId = localStorage.getItem("siteId");
    
    var that = this;
    that.customerId = localStorage.getItem("customerId");
    this.siteId = localStorage.getItem("siteId");
    console.error("登陆后的 customerId ：" + this.customerId);
    if(this.customerId) {
      //用户基本信息
      that.getUserCenterHttp();
    }
  }

  gotoLogin() {
    this.navCtrl.push(SigninPage)
  }

  //获取用户信息方法
  getUserCenterHttp() {
    var that = this;
    that.token = localStorage.getItem("token");
    that.customerId = localStorage.getItem("customerId");
    that.customerToken = localStorage.getItem("customerToken");

    if(that.customerId) {
      that.customerService.getUserCenterHttp(that.customerId, that.customerToken).subscribe(res => {
        console.log("请求getUserCenterHttp个人中心api: ");
        console.info(res)
        if(res && res.errorCode == 0 ) {
          var data = res.data;
          that.customer = data;

          if(!data.name || data.name == '' || data.name == 'null' || data,name == 'undefined') {
            var isWeChat = localStorage.getItem("isWeChat");
            console.log("isWeChat:"+isWeChat)
            if(isWeChat != '1') {
              var userAgent = navigator.userAgent;//
              var descn = "个人中心，昵称不存在，当前 customerId =" + that.customerId;
              localStorage.setItem("isWeCat", '1');
              that.userinfoService.getBrowerInfo('', '', userAgent, descn, that.token).subscribe(res => {
                console.error("getBrowerInfo");
              })
            }
          }
          localStorage.setItem("customerName", that.customer.name);
          if(that.customer.avatarCustomized && that.customer.avatarUrl) {
            that.avatarUrl = AppConfig.IMAGE_PATH_TWO + "/avatar/" + that.customer.avataraurl;
          }else if(!that.customer.avatarCustomized && that.customer.avatarUrl) {
            that.avatarUrl = that.customer.avatarUrl;
          }
          if(that.customer.recordId) {//recordId为空？
            that.recordId = that.customer.recordId;
          }
          // that.generateQRCode(res.data);
        }
      },error => {
        console.log("getUserCenterHttp")
        
        ErrorUtils.handleError(error, this.alerCtrl, this.navCtrl, SigninPage)
      });
      that.customerService.activityLuckyDraw(that.token,that.customerId).subscribe(res => {
        if(res && res.erroeCode == 0) {
          this.activityDrawTime = res.Data.times;
        }
      },error => {
        console.log("activityDrawTime")
        ErrorUtils.handleError(error, this.alerCtrl, this.navCtrl, SigninPage)
      })
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SigninPage } from '../login/signin/signin';
import { CustomerServiceProvider } from '../../providers/customer-service/customer-service';
import { UserinfoServiceProvider } from '../../providers/userinfo-service/userinfo-service';

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

  sietId: string;
  token: string;
  siteId: string;
  avatarUrl: string = "../assets/images/defaultAv.png";//个人中心 background
  customerId: any;
  customerToken: string;
  customer: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public customerService: CustomerServiceProvider,
    public userinfoService: UserinfoServiceProvider
  ) {
    // this.customerId = localStorage.getItem("customerId");
  }
  
  ngOnInit(): void {
   
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UsercenterPage');
  }

  ionicViewillEnter() {
    this.token = localStorage.getItem("token");
    this.customerId = localStorage.getItem("customerId");
    this.sietId = localStorage.getItem("siteId");
    
    var that = this;
    that.customerId = localStorage.getItem("customerId");
    this.siteId = localStorage.getItem("siteId");
    console.error("登陆后的 customerId" + this.customerId);
    if(this.customerId) {
      that.getUserCenterHttp();
    }
  }

  gotoLogin() {
    this.navCtrl.push(SigninPage)
  }

  getUserCenterHttp() {
    var that = this;
    that.token = localStorage.getItem("token");
    that.customerId = localStorage.getItem("customerId");
    that.customerToken = localStorage.getItem("customerToken");

    if(that.customerId) {
      that.customerService.getUserCenterHttp(that.customerId, that.customerToken).subscribe(res => {
        console.info("请求getUserCenterHttp个人中心api " + res)
        if(res && res.error.code == 0 ) {
          var data = res.data;
          that.customer = data;

          if(!data.name || data.name == '' || data.name == 'null' || data,name == 'undefined') {
            var isWeChat = localStorage.getItem("isWeChat");
            if(isWeChat != '1') {
              var userAgent = navigator.userAgent;//
              var descn = "个人中心，昵称不存在，当前 customerId =" + that.customerId;
              localStorage.setItem("isWeCat", '1');
              that.userinfoService.getBrowerInfo('', '', userAgent, descn, that.token).subscribe(res => {
                
              })
            }
          }
        }
      })
    }
  }

}

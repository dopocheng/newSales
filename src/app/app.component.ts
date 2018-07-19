import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AppConfig} from "./app.config";
import {Http} from '@angular/http';
import {CommonUtils} from "../utils/common.utils";
import {ErrorUtils} from "../utils/error.utils";

import {SigninPage} from "../pages/login/signin/signin";
import { TabsPage } from '../pages/tabs/tabs';
import { TokenServiceProvider } from '../providers/token-service/token-service'
import {UserinfoServiceProvider} from "../providers/userinfo-service/userinfo-service";

declare var wx:any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  
  rootPage:any = TabsPage;
  token: Promise<string>;
  code: string;
  state: string;
  sessionId: string;
  userinfo: any = [];

  constructor(
              public platform: Platform, 
              private _app: App,
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public tokenService: TokenServiceProvider,
              public http: Http,
              public alerCtrl: AlertController,
              public userinfoService: UserinfoServiceProvider
            ) {
    localStorage.removeItem("token");
    console.error("remove toke" + this.token);
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    localStorage.setItem("FirstStart", "true");
    var that = this;
    that.tokenService.getEnjoyHomeToken().subscribe(res => {
       if(res.access_token) {
          console.error("嘉宾的 token：" + res.access_token);
          // this.initapp(res.access_token);
       }else{
         console.error('获取失败！！')
       }
    },error => {console.error("tokenService 出错")});
    return;
  }

  ngOnInit(): void {
   
  }

  initapp(token) {
    var that = this;
    let sessionId = localStorage.getItem("sessionId");
    // console.log("是不是微信的",navigator.userAgent)
    // console.log("当前地址",window.location)
    if (CommonUtils.is_weixn()) {
      console.log('运行环境是微信');
      console.log("初始化微信js sdk");
      var subUrl = window.location.href.split('#')[0];
      var signatureUrl: any = AppConfig.apiUrl() + "/wxCommons/getShareSign?url=" + encodeURIComponent(subUrl);
      signatureUrl = signatureUrl + "&access_token=" + token;
      that.initWx(signatureUrl).subscribe(res => {
        var response = res.data;
        console.log(response);
        wx.config({
          debug: false,                  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: response.appId,         //'wx03605b6ba300b93b', // 必填，公众号的唯一标识
          timestamp: response.timestamp, // 必填，生成签名的时间戳
          nonceStr: response.noncestr,   // 必填，生成签名的随机串
          signature: response.signature, // 必填，签名，见附录1
          jsApiList: ['chooseImage',
            "getLocalImgData",
            'scanQRCode',
            'uploadImage',
            'openAddress',
            'chooseWXPay',
            'hideMenuItems',
            'closeWindow',
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareQZone",
            "onMenuShareWeibo"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.error((res) => {
          console.log("config失败",res);
        });
      });
      if(!sessionId){
        // that.getUserInfo(token);
      }
    }
  }

  initWx(url) {
    return this.http.get(url).map(res => res.json());
  }

  getUserInfo(token) {
    var that = this;
    that.code = CommonUtils.getUrlParam(window.location.search, "code");
    that.state = CommonUtils.getUrlParam(window.location.search, "state");
    console.log("code:" + that.code + ",  state:" + that.state);
    // alert("获取的code以及state"+ that.code +that.state)

    if (that.code && that.state) {
      that.userinfoService.getUserInfo(that.code, that.state, token).subscribe(res => {
        console.log("获取微信用户信息",res);
        // alert("获取微信用户信息"+ res)
        // alert("获取微信用户信息sessionId"+ res.data.userinfo.id)
        if (res && res.errorCode == 0) {
          that.userinfo = res.data;
          that.sessionId = that.userinfo.id;
          localStorage.setItem("sessionId", that.sessionId);
          localStorage.setItem("nickName", that.userinfo.nickName);
          localStorage.setItem("gender", that.userinfo.gender);
          localStorage.setItem("avatarUrl", that.userinfo.avatarUrl);
          console.log(that.userinfo);
          console.log(that.sessionId);
        }
      },error => {
        ErrorUtils.handleError(error,this.alerCtrl, that._app.getActiveNav(), SigninPage);
      });
    }else {
      var userAgent = navigator.userAgent
      var descn = "微信环境，code为空。进来的地址：" + encodeURIComponent(window.location.href)
      // console.log("不是微信，code为空",userAgent)
      that.userinfoService.getBrowerInfo(that.code, that.state,userAgent ,descn ,token).subscribe(res => {

        // console.log("上传code为空时的参数",res);
      })
    }
  }

  
}

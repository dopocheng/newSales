import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { TokenServiceProvider } from '../providers/token-service/token-service'
/**
 *页面初始化:请求 API 获取 token ,拉取用户基本信息
 * @Pitcher
 * @export
 * @class MyApp
 * @implements {OnInit}
 */
@Component({
  templateUrl: 'app.html'
})

export class MyApp implements OnInit {

  rootPage: any = TabsPage;//初始化TabsPage
  token: Promise<string>;//声明token变量

  constructor(
              public platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public tokenService: TokenServiceProvider,//初始化 token 接口            
  ) {
    localStorage.removeItem("token");
    console.error("remove toke");
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    localStorage.setItem("FirstStart", "true");
    var that = this;
    that.tokenService.getEnjoyHomeToken().subscribe(res => {//请求处理 token 接口返回的数据
      //判断书否获取到 token
      if (res.access_token) {
        console.error("嘉宾的 token：" + res.access_token);
        // this.initapp(res.access_token);
        localStorage.setItem("token", res.access_token);//保存到本地
      } else {
        console.error('获取失败！！')
      }
    }, error => { console.error("tokenService 出错 :" + error) });
    return;
  }

  ngOnInit(): void {

  }


}

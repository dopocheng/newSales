import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SignupPage } from '../../../pages/login/signup/signup'

import { CustomerServiceProvider } from '../../../providers/customer-service/customer-service'
import { SendSmsServiceProvider } from './../../../providers/send-sms-service/send-sms-service';
import { ErrorUtils } from '../../../utils/error.utils';

/**
 * 验证码登录
 * @Picter
 * @export
 * @class SigninPage
 * @implements {OnInit}
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage implements OnInit{
  errTip: string = "";//验证码发送状态
  errorTip: string = "";//用户操作状态
  token: string;//后台随机生成
  codeSended: boolean;//验证码发送
  count: number;//倒计时
  platFormFlag: number = 0;//验证码请求次数
  pet: string = "phone";//
  accountLoginForm: FormGroup;//账号登录
  phoneLoginForm: FormGroup;//手机号码登录
  loginName: any;//昵称
  password: any;//密码
  phone: any;//手机号
  code: any;//验证码
  sessionId: string;
  vistorId: string;
  isWeixin:boolean = false;//是否微信环境
  nickNameStr: any;
  siteId: string;
  fileName: string ="";
  
  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public sendSmsService: SendSmsServiceProvider,
              public alerCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public customerService: CustomerServiceProvider,
              public viewCtrl: ViewController,
              ) {
    this.accountLoginForm = this.formBuilder.group({
      loginName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
    this.phoneLoginForm = this.formBuilder.group({
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required, 
                  Validators.pattern("^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|16[0-9]|19[0-9]|14[0-9])[0-9]{8}$")])],
      code: ['', Validators.compose([Validators.required])],
    });
    
    this.loginName = this.accountLoginForm.controls['loginName'];//
    this.password = this.accountLoginForm.controls['password'];
    this.phone = this.phoneLoginForm.controls['phone'];
    this.code = this.phoneLoginForm.controls['code'];
   
  }
  
  ngOnInit(){
    //获取本地 token
    this.token = localStorage.getItem("token");
    this.sessionId = localStorage.getItem("sessionId");
    this.vistorId = localStorage.getItem("vistorId");//游客 Id
    this.nickNameStr = localStorage.getItem("nickNameStr")//获取昵称
    this.siteId = localStorage.getItem("siteId")
  }

  ionViewWillEnter() {
    //获取当前浏览器环境,ua
    var ua = navigator.userAgent.toLowerCase();
    // 判断是否微信
    this.isWeixin = ua.indexOf("micromessenger")!=-1? true:false;
    }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SigninPage');
  }

  // 发送验证码方法
  sendCode(value) {
    console.error("正在发送验证码...");
    if(localStorage.getItem("platFormFlag")){
      var oldIndex = parseInt(localStorage.getItem("platFormFlag"));
      oldIndex++;
      localStorage.removeItem("platFormFlag");
      // 请求验证码次数
      localStorage.setItem("platFormFlag",oldIndex.toString());
    } else {
      localStorage.setItem("platFormFlag", this.platFormFlag.toString());
    }
    var newIndex = localStorage.getItem("platFormFlag");
    this.platFormFlag = parseInt(newIndex);
    var that = this;
    this.count = 59;
    this.codeSended = true;
    // 验证码计时
    var timer = setInterval(() => {
      that.count--;
      if (that.count < 0) {
        clearInterval(timer);
        that.codeSended = false;
      }
    },1000);
    //请求 API 传参
    that.sendSmsService.sendValidateCode(that.token, value.phone, 12, this.platFormFlag, 86).subscribe(res => {
      if(res && res.errorCode == 0)  {
          this.errTip = "";
      }else{
        this.errTip = "发送验证码失败，请重试！！"
      }
    }, error => {
        ErrorUtils.handleError(error,that.alerCtrl, that.navCtrl, SigninPage);
    })  
  }

  //手机号码提交登录
  phoneLogin(value) {
    var that =this;
    let loading = this.loadingCtrl.create();
    loading.present()
    this.customerService.phoneLogin(that.token, value.phone, value.code, that.sessionId, this.vistorId, 0).subscribe(res => {
      loading.dismiss();
      console.log("手机验证码登录返回数据" + res);
      if(res && res.errorCode == 0 ) {
        this.errorTip = "";
        let customer = res.data;
        localStorage.setItem("customerId", customer.id);
        localStorage.setItem("customerToken", customer.token);
        localStorage.setItem("phone", res.data.phone);
        localStorage.setItem("name", res.data.name);
        if(res.data.recordId) {
          localStorage.setItem("recordId", res.data.recordId);
        }
        // 关闭当前页面
        that.viewCtrl.dismiss();
      }else if(res.errorCode == 90938) {
        let phoneUnUsedAlert = that.alerCtrl.create({
          title: '提示',
          message: '该手机还未注册，是否立即成为家瓦会员?',
          buttons: [{
            text: '成为会员',
            handler: () => {
              //判断是否微信环境，是微信调 signup 方法；不是则要跳转到微信
              if(!this.isWeixin) {
                console.error("跳转注册")
                this.viewCtrl.dismiss();
                this.navCtrl.push(SignupPage, {
                  isFromWx:false,
                  code:value.code,
                  phoneNum:value.phone
                });
              }else{
                this.signup(value);
              }
            }
          },{
            text: '返回',
            handler: () => {
              return;
            }
          }
        ]
        });
        phoneUnUsedAlert.present();//
      } else if (res.errorCode == 90933) {
        this.errTip = "验证码错误，请重新输入！"
      }else if(res.errorCode == 90946) {
        this.errTip = "验证码错误，请重新输入！"
      }else if(res.errorCode == 90942) {
        this.errTip = "登录失败，获取令牌出错！"
      }
    },error => {
      ErrorUtils.handleError(error, that.alerCtrl, that.navCtrl, SigninPage);
    });
  }

//清除验证码
  clearErrorTip(){
    this.errTip = "";
  }
//清除用户
  clearErrorTip1(){
    this.errorTip = "";
  }
//微信注册入口
  signup(value) {
    let loading = this.loadingCtrl.create({});
    loading.present();
    var tempNickName = encodeURIComponent(this.nickNameStr);
    this.customerService.signup(this.token, value.phone, this.sessionId, tempNickName, this.siteId, value.code, this.fileName,1).subscribe(res => {
      console.error("微信注册成功");
      console.info(res);
      if(res && res.errorCode == 0) {
        setTimeout(() => {
          var that = this;
          this.customerService.phoneLogin(that.token, value.phone, value.code, that.sessionId, this.vistorId, 1).subscribe(res => {
            loading.dismiss();
            //cosole.log("注册成功后直接登录")
            if(res && res.errorCode == 0) {
              let customer = res.daat;
              localStorage.setItem("customerId", customer.id);
              localStorage.setItem("customerToken", customer.token);//token,登录之后返回customer权限的token
              localStorage.setItem("phone", res.data.phone);
              localStorage.setItem("name", res.data.name);
              if(res.data.recordId) {
                localStorage.setItem("recordId", res.data.recordId);
              }
              that.viewCtrl.dismiss();
            }else if(res.errorCode == 90942) {
              let tokenErrAlert = that.alerCtrl.create({
                title: '提示',
                message: '登录失败，获取令牌出错！',
                buttons: ['好的']
              });
              tokenErrAlert.present();
            }

          },error => {
            ErrorUtils.handleError(error,that.alerCtrl, that.navCtrl, SigninPage);
          });
        },2000);
      } else if(res.errorCode == 9035) {
        let nameErrAlert = this.alerCtrl.create({
          title: '提示',
          message: '用户名已被注册',
          buttons: ['好的']
        });
        nameErrAlert.present();
      }else if(res.errorCode == 90933) {
        let nameErrAlert = this.alerCtrl.create({
          title: '提示',
          message: '验证码错误请重新输入！',
          buttons: ['好的']
        });
        nameErrAlert.present();
      }else if(res.errorCode == 9034){
        let nameErrAlert = this.alerCtrl.create({
          title: '提示',
          message: '尊敬的家瓦老用户，您的账号已存在于我们的系统中，您可以直接使用验证码进行登录。或者使用忘记密码功能重置您的密码',
          buttons: ['好的']
        });
        nameErrAlert.present();
      }
    }, error => {ErrorUtils.handleError(error,this.alerCtrl, this.navCtrl, SigninPage);});
  }


}

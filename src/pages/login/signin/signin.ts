import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  errTip: string;//验证码发送状态
  errorTip: string;//用户操作状态
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
  
  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public sendSmsService: SendSmsServiceProvider,
              public alerCtrl: AlertController,
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
  
  ngOnInit(): void {
    //获取本地 token
    this.token = localStorage.getItem("token");
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
      localStorage.setItem("platFormFlag",oldIndex.toString());
    } else {
      localStorage.setItem("platFormFlag", this.platFormFlag.toString());
    }
    var newIndex = localStorage.getItem("platFormFlag");
    this.platFormFlag = parseInt(newIndex);
    var that = this;
    this.count = 59;
    this.codeSended = true;
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

}

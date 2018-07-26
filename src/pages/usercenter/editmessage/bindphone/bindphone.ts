import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerServiceProvider } from '../../../../providers/customer-service/customer-service'
import { SigninPage } from '../../../login/signin/signin';
import { ErrorUtils } from '../../../../utils/error.utils';
import { SendSmsServiceProvider } from '../../../../providers/send-sms-service/send-sms-service'


@IonicPage()
@Component({
  selector: 'page-bindphone',
  templateUrl: 'bindphone.html',
})
export class BindphonePage implements OnInit{
  bindPhoneForm: FormGroup;//绑定控件
  phone: any;//手机号
  code: any;//验证码
  token: string;//微信 token
  customerToken: string;//登录后 token
  customer: string;//注册过的用户
  customerId: string;//用户 id
  platFormFlag: number = 0;//标志
  count: number;//验证码计时
  codeSended: boolean = false;//验证码发送状态

  constructor(
            public navCtrl: NavController,
            public navParams: NavParams,
            public formBuilder: FormBuilder,
            public customerService: CustomerServiceProvider,
            public alertCtrl: AlertController,
            public sendSmsService: SendSmsServiceProvider
  ) {
    this.bindPhoneForm = this.formBuilder.group({
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required, Validators.pattern("^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|16[0-9]|19[0-9]|14[0-9])[0-9]{8}$")])],
      code: ['', Validators.compose([Validators.required])]
    });
    this.phone = this.bindPhoneForm.controls['phone'];
    this.code = this.bindPhoneForm.controls['code'];
  }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    this.customerToken = localStorage.getItem("customerToken");//用户登陆之后返回权限的 token 查看 token-service
    this.customerId = localStorage.getItem("customerId");
    if(!this.customerId) {
      console.log("用户没有登录！！！");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BindphonePage');
  }

  // 绑定手机
  bindPhone(value) {
    var that = this;
    that.customerService.bindPhone(that.token, that.customerId, value.phone, value.code).subscribe(res => {
      if(res && res.errorCode == 0) {
        let successAlert = this.alertCtrl.create({
          title: '提示',
          message: '绑定成功!',
          buttons: [{
            text: '好的',
            handler: () => {
              that.navCtrl.pop();
            }
          }]
        });
        successAlert.present();
      }else if(res.errorCode == 99033) {
        let codeErrAlert = this.alertCtrl.create({
          title: '提示',
          message: '验证码错误请重新输入！',
          buttons: ['好的']
        });
        codeErrAlert.present();
      }else{
        let bindErrAlert = this.alertCtrl.create({
          title: '提示',
          message: '绑定失败！',
          buttons: ['重试']
        });
        bindErrAlert.present();
      }
    },error =>{
      ErrorUtils.handleError(error, this.alertCtrl, this.navCtrl, SigninPage)
    })
  }

  //发送验证码
  sendCode(value) {
    if(localStorage.getItem("platFormFlag")){
      var oldIndex = parseInt(localStorage.getItem("platFormFlag"));
      oldIndex++;
      localStorage.removeItem("platFormFlag");
      localStorage.setItem("platFormFlag",oldIndex.toString());
    }else{
      localStorage.setItem("platFormFlag",this.platFormFlag.toString());
    }
    var newIndex = localStorage.getItem("platFormFlag");
    this.platFormFlag = parseInt(newIndex);
    var that = this;
    that.count = 59;
    that.codeSended = true;
    var timer = setInterval(function () {
      that.count--;
      if (that.count < 0) {
        clearInterval(timer);
        that.codeSended = false;
      }
    }, 1000);
    that.sendSmsService.sendValidateCode(that.customerToken, value.phone,14,this.platFormFlag,86).subscribe(res => {
      if (res && res.errorCode == 0) {
        //console.log("发送成功")
      } else {
        let reciverAlert = that.alertCtrl.create({
          title: '提示',
          message: '发送验证码失败,请重试！',
          buttons: ['好的']
        });
        reciverAlert.present();
      }
    },error => {
      //console.log(error);
      ErrorUtils.handleError(error, that.alertCtrl, that.navCtrl, SigninPage);
    });
  }


}

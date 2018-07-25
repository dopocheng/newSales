import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorUtils } from '../../../../utils/error.utils'
import { SigninPage } from '../../../../pages/login/signin/signin'

import { SendSmsServiceProvider } from '../../../../providers/send-sms-service/send-sms-service'


@IonicPage()
@Component({
  selector: 'page-edituserpassword',
  templateUrl: 'edituserpassword.html',
})
export class EdituserpasswordPage {
  validatorForm: FormGroup;
  accountPhone: any;//手机号码
  updatePwdForm: FormGroup;
  token: string; 
  customerId: string;//用户 Id
  platFormFlag: number = 0;
  count: number;
  codeSended: boolean =false;
  status: number = 0;//标志符

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public sendSmsService: SendSmsServiceProvider,
              public alerCtrl: AlertController
  ) {
    this.accountPhone = localStorage.getItem("phone");
    this.validatorForm = new FormGroup({
      phone: new FormControl({value: this.accountPhone, disabled: true}, Validators.required),
      code: new FormControl('', Validators.required)
    });
    this.updatePwdForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(8), Validators.required, Validators.pattern("^[a-z0-9A-Z_\*\.\?\$\#\@\!\`\^\%\=\+\-]+$")])],
      re_password: ['', Validators.compose([Validators.required, this.equalto('password')])],
    })
  }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    this.customerId = localStorage.getItem("customerId");
  }


  sendSmsCode(value) {//发送验证码
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
    that.sendSmsService.sendValidateCode(that.token, that.accountPhone, 13,this.platFormFlag,86).subscribe(res => {
      if (res && res.errorCode == 0) {
        //console.log("发送成功");
      } else {
        let reciverAlert = that.alerCtrl.create({
          title: '提示',
          message: '发送验证码失败,请重试！',
          buttons: ['好的']
        });
        reciverAlert.present();
      }
    }, error => {
      ErrorUtils.handleError(error, that.alerCtrl, that.navCtrl, SigninPage);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EdituserpasswordPage');
  }

  // 二次密码校验
  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let input = control.value;
      let isValid = control.root.value[field_name] == input
      if (!isValid)
        return {'equalTo': {isValid}}
      else
        return null;
    };
  }

  checkPhone() {
    console.log('ionViewDidLoad EdituserpasswordPage');
  }
}


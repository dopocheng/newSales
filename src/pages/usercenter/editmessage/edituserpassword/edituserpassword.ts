import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController, ModalController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorUtils } from '../../../../utils/error.utils'
import { SigninPage } from '../../../../pages/login/signin/signin'

import { SendSmsServiceProvider } from '../../../../providers/send-sms-service/send-sms-service'
import { CustomerServiceProvider } from '../../../../providers/customer-service/customer-service'

@IonicPage()
@Component({
  selector: 'page-edituserpassword',
  templateUrl: 'edituserpassword.html',
})
export class EdituserpasswordPage {
  token: string;
  customerId: string;
  sessionId: string;
  status: number = 0;
  validatorForm: FormGroup;
  updatePwdForm: FormGroup;
  accountName: any;
  imageCode: any;
  phone: any;
  platFormFlag:number=0;
  code: any;
  password: any;
  re_password: any;
  accountPhone: any;
  codeSended: boolean = false;
  count: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alerCtrl: AlertController,
              public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              public sendSmsService: SendSmsServiceProvider,
              public customerService: CustomerServiceProvider) {

    this.validatorForm = formBuilder.group({
      phone: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
    });
    this.accountPhone = localStorage.getItem("phone");
    this.validatorForm = new FormGroup({
      phone: new FormControl({value: this.accountPhone, disabled: true}, Validators.required),
      code: new FormControl('', Validators.required)
    });
    this.updatePwdForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(8), Validators.required, Validators.pattern("^[a-z0-9A-Z_\*\.\?\$\#\@\!\`\^\%\=\+\-]+$")])],
      re_password: ['', Validators.compose([Validators.required, this.equalto('password')])],
    });
    this.phone = this.validatorForm.controls['phone'];
    this.code = this.validatorForm.controls['code'];
    this.password = this.updatePwdForm.controls['password'];
    this.re_password = this.updatePwdForm.controls['re_password'];
  }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    this.customerId = localStorage.getItem("customerId");
  }

  /**
   * 发送手机验证码
   * @param value
   */
  sendSmsCode(value) {
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

  /**
   * 验证手机号
   * @param value
   */
  checkPhone(value) {
    var that = this;
    that.customerService.forgetCheckPhone(that.token, this.accountPhone, value.code).subscribe(res => {
      if (res && res.errorCode == 0) {
        that.status = 1;
      } else if (res.errorCode == 90933) {
        let codeErrAlert = that.alerCtrl.create({
          title: '提示',
          message: '验证码错误请重新输入！',
          buttons: ['好的']
        });
        codeErrAlert.present();
      }
    }, error => {
      ErrorUtils.handleError(error, that.alerCtrl, that.navCtrl, SigninPage);
    });
  }

  /**
   * 更新密码
   * @param value
   */
  updatePwd(value) {
    console.log("update")
    let loading = this.loadingCtrl.create({});
    loading.present();
    this.customerService.updatePwd(this.token, this.accountPhone, value.password).subscribe(res => {
      loading.dismiss();
      if (res && res.errorCode == 0) {
        let successAlert = this.alerCtrl.create({
          title: '提示',
          message: '密码修改成功！',
          buttons: [
            {
              text: '好的',
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        successAlert.present();
      } else if (res.errorCode == 90937) {
        let userErrAlert = this.alerCtrl.create({
          title: '提示',
          message: '用户不存在！',
          buttons: ['好的']
        });
        userErrAlert.present();
      }
    }, error => {
      ErrorUtils.handleError(error, this.alerCtrl, this.navCtrl, SigninPage);
    });
  }

  clearRePassword() {
    this.re_password.reset();
  }

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

  
}


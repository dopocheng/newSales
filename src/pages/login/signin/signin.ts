import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SendSmsServiceProvider } from './../../../providers/send-sms-service/send-sms-service';
import { ErrorUtils } from '../../../utils/error.utils'
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage implements OnInit{
  errTip: string;
  errorTip: string;
  token: string;
  codeSended: boolean;
  count: number;
  platFormFlag: number = 0;
  pet: string = "phone";
  accountLoginForm: FormGroup;
  phoneLoginForm: FormGroup;
  loginName: any;
  password: any;
  phone: any;
  code: any;
  
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
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required, Validators.pattern("^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|16[0-9]|19[0-9]|14[0-9])[0-9]{8}$")])],
      code: ['', Validators.compose([Validators.required])],
    });
    
    this.loginName = this.accountLoginForm.controls['loginName'];
    this.password = this.accountLoginForm.controls['password'];
    this.phone = this.phoneLoginForm.controls['phone'];
    this.code = this.phoneLoginForm.controls['code'];
  }
  
  ngOnInit(): void {
    this.token = localStorage.getItem("token");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  sendCode(value) {
    if(localStorage.getItem("platFormFlag")){
      var oldIndex = parseInt(localStorage.getItem("platFormFlag"));
      oldIndex++;
      localStorage.removeItem("platFormFlag");
      localStorage.setItem("platFormFlag",this.platFormFlag.toString());
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
    that.sendSmsService.sendValidateCode(that.token, value.phone, 12, this.platFormFlag, 86).subscribe(res => {
      if(res && res.errorCode == 0)  {
          this.errorTip = "";
      }else{
        this.errTip = "发送验证码失败，请重试！！"
      }
    }, error => {
        ErrorUtils.handleError(error,that.alerCtrl, that.navCtrl, SigninPage);
    })  
  }

}

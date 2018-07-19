import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
export class SigninPage {
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  sendCode(value) {
    
  }

}

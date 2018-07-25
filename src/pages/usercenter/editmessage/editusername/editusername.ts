import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerServiceProvider } from '../../../../providers/customer-service/customer-service'
import { ErrorUtils } from '../../../../utils/error.utils';
import { SigninPage } from '../../../login/signin/signin';

@IonicPage()
@Component({
  selector: 'page-editusername',
  templateUrl: 'editusername.html',
})
export class EditusernamePage {
  editNickNameForm: FormGroup;
  nickName: any;
  token: string;
  customerId: string;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public toastStrl: ToastController,
              public alertCtrl: AlertController,
              public customerService: CustomerServiceProvider
  ) {
    let name = this.navParams.get("nickName");
    this.editNickNameForm =this.formBuilder.group({
      nickName: ['', Validators.compose([Validators.required])]
    });
    this.editNickNameForm.setValue({
      nickName: name
    });
    this.nickName = this.editNickNameForm.controls['nickName'];
    this.token = localStorage.getItem("token");
    this.customerId = localStorage.getItem("customerId")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditusernamePage');
  }

  editNickName(value) {
    var that = this;
    let customerToken =localStorage.getItem("customerToken");
    that.customerService.updateNickName(customerToken, that.customerId, value.nickName).subscribe(res => {
      if(res && res.errorCode == 0) {
        that.nickName = res.data.name;
        let toast = that.toastStrl.create({
          message: '用户昵称更新成功',
          duration: 2000
        });
        toast.present();
        that.navCtrl.pop();
      }else{
        let reciverAlert = that.alertCtrl.create({
          title: '提示',
          message: '更新用户失败',
          buttons: ['好的']
        });
        reciverAlert.present();
      }
    }, error => {ErrorUtils.handleError(error, that.alertCtrl, that.navCtrl, SigninPage)})
  }

}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SigninPage } from '../login/signin/signin';

/**
 * Generated class for the UsercenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usercenter',
  templateUrl: 'usercenter.html',
})
export class UserCenterPage implements OnInit {

  avatarUrl: string = "../assets/images/defaultAv.png";//个人中心 background
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
  }
  
  ngOnInit(): void {
   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UsercenterPage');
  }

  gotoLogin() {
    this.navCtrl.push(SigninPage)
  }

}

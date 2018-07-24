import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// 退出登录,更换头像

@IonicPage()
@Component({
  selector: 'page-editmessage',
  templateUrl: 'editmessage.html',
})
export class EditmessagePage {

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditmessagePage');
  }

}

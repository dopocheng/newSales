import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-bankcard',
  templateUrl: 'bankcard.html',
})
export class BankcardPage {

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankcardPage');
  }

}

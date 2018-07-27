import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-creatmerchants',
  templateUrl: 'creatmerchants.html',
})
export class CreatmerchantsPage {

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatmerchantsPage');
  }

}

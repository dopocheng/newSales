import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal'

@IonicPage()
@Component({
  selector: 'page-previewpage',
  templateUrl: 'previewpage.html',
})
export class PreviewpagePage {
  modals: any;
  imgResource: any;
  curIndex: any;
  isDismissed: boolean = false;
  isPoped: boolean =false;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController
            ) {
  this.curIndex = this.navParams.get("curIndex");
  this.imgResource = this.navParams.get("imgResource");
  }

  ionViewDidLoad() {
    console.log("进入 previewpage 页面");
    this.modals = this.modalCtrl.create(GalleryModal, {
      photos: this.imgResource,
      initialSlide: this.curIndex,
    });
    this.modals.onDidDismiss(data => {
      this.isDismissed = true;
      if(this.isPoped === false) {
        this.navCtrl.pop();
      }
    });

    this.modals.present();
  }

  ionViewWillUnload() {
    if(this.isDismissed === false) {
      this.isPoped = true;
      this.modals.dismiss();
    }
  }

}

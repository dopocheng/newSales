import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal'

@IonicPage()
@Component({
  selector: 'page-previewpage',
  templateUrl: 'previewpage.html',
})

//二维码预览展示页面
export class PreviewpagePage {

  modals: any;//modal 框
  imgResource: any;//小二维码
  curIndex: any;//当前用户 id
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
    //
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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { SigninPage } from '../../login/signin/signin';
import { EditusernamePage } from '../editmessage/editusername/editusername';
import { EdituserpasswordPage }from '../editmessage/edituserpassword/edituserpassword';
import { BindphonePage } from '../editmessage/bindphone/bindphone'

import { AppConfig } from '../../../app/app.config';
import { CustomerServiceProvider } from '../../../providers/customer-service/customer-service';
import { ErrorUtils} from '../../../utils/error.utils';
import { CommonUtils } from '../../../utils/common.utils';
declare var wx: any;
console.info(wx)

// 退出登录,更换头像

@IonicPage()
@Component({
  selector: 'page-editmessage',
  templateUrl: 'editmessage.html',
})
export class EditmessagePage {

  token: string;//微信 token
  customerId: string;//登录后的 Id
  customerToken: string;//登录后的权限 Id
  loginName: any;//
  avatar: string = "../../assets/images/defaultAv.png";
  imagePath = AppConfig.IMAGE_PATH;
  nickName: any;//昵称
  phone: any;//手机号
  tabBarElement: any;//导航栏
  headerBarElement: any;

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              public customerService: CustomerServiceProvider,
              public alerCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditmessagePage');
  }

  ionViewWillEnter() { //隐藏底部 tabBar
    this.tabBarElement = document.querySelector('.tabbar');

    if(this.tabBarElement){
      this.tabBarElement.style.display = 'none';
    }
  }

  ionViewDidEnter() {
    this.getUserCenterHttp();
  }

  //绑定手机号(删掉了次功能，放在注册了))
  bindPhone() {
    console.log("bindPhone")
    this.navCtrl.push(BindphonePage);
  }

  //修改 password
  editPassword() {
    console.log("gotoEditepasseord")
    this.navCtrl.push(EdituserpasswordPage)
  }

  //修改 nickName
  gotoEditusername() {
    console.log("gotoEditusername")
    this.navCtrl.push(EditusernamePage, {nickName: this.nickName});
  }

  //修改 avatar
  chooseImage() {
    var that = this;
    var serverId = [];
    console.log("CommonUtils.is_weixn()"+ CommonUtils.is_weixn())
    if (CommonUtils.is_weixn()) {
      wx.ready(function () {
        console.log("wxxw");
        wx.chooseImage({
          count: 1, // 默认9n
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            let loading = that.loadingCtrl.create({
              content: "上传中...",
              cssClass: "custom_loading"
            });
            loading.present();
            wx.uploadImage({
              localId: localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 0, // 默认为1，显示进度提示
              success: function (res) {
                serverId.push(res.serverId);
                that.customerService.uploadAvatar(that.customerToken, that.customerId, serverId).subscribe(res => {
                  loading.dismiss();
                  //console.log(res);
                  if (res && res.errorCode == 0) {
                    document.getElementById("avatar").setAttribute("src", AppConfig.IMAGE_PATH_TWO + "/avatar/" + res.data);
                    let success = that.toastCtrl.create({
                      message: '上传成功',
                      position: 'middle',
                      duration: 1000
                    });
                    success.present();
                  }
                }, error => {
                  loading.dismiss();
                  ErrorUtils.handleError(error, that.alerCtrl, that.navCtrl, SigninPage);
                });
              }
            });
          },
          fail: function (res) {
          }

        });

      });
      return;
    }
  }

  //获取基本信息
  getUserCenterHttp() {
    var that = this;
    that.token = localStorage.getItem("token");
    that.customerId = localStorage.getItem("customerId");
    that.customerToken = localStorage.getItem("customerToken");
    if(!this.customerId) {
      console.log("没有登录！");
    }else{
      that.customerService.getUserCenterHttp(that.customerId, that.customerToken).subscribe(res => {
        console.log("请求getUserCenterHttp个人中心api: ");
        console.info(res)
        if(res && res.errorCode == 0 ) {
          that.phone = res.data.phone;
          that.nickName = res.data.name;
          that.avatar = res.data.avatarUrl;//头像
          that.loginName = res.data.loginName;//登录名 cutomer_1532413707186
          
          if(res.data.avatarCustomized && res.data.avatarUrl) {//true && 10.png
            that.avatar = AppConfig.IMAGE_PATH_TWO + "/avatar/" + res.data.avatarUrl;
          }else if(!res.data.avatarCustomized && res.data.avatarUrl) {
            that.avatar = res.data.avatarUrl;
          }
        }
      },error => {
        console.error("getUserCenterHttp")
        ErrorUtils.handleError(error, this.alerCtrl, this.navCtrl, SigninPage)
      })
    }
  }

}

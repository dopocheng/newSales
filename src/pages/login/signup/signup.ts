import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl} from '@angular/forms';
import { FileUtils } from '../../../utils/file.utils'

// 非微信用户注册页面


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage implements OnInit{
  isWeixin: boolean = true;;
  avatarUrl: string;//头像路径
  gender: string;
  siteId: any;//位置Id
  visitorId: string;
  sessionId: string;//
  token: string;//
  validatorCode: any;//
  nickname: any;//昵称
  phoneNum:any;//手机号
  re_password: any;//确认密码
  callback: any;//返回
  password: any;//密码
  sendCodeForm:FormGroup;//验证码
  updatePwdForm: FormGroup;//密码格式

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder
  ) {
    var that = this;
    // 验证码
    that.sendCodeForm = this.formBuilder.group({
    nickName: ['', Validators.compose([])],
    phoneNum: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required, Validators.pattern("^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|16[0-9]|19[0-9]|14[0-9])[0-9]{8}$")])],
    validatorCode: ['', Validators.compose([Validators.required])]
    });

    // 更新密码
    this.updatePwdForm = this.formBuilder.group({
    password: ['', Validators.compose([Validators.minLength(8),Validators.required,Validators.pattern("^[a-z0-9A-Z_\*\.\?\$|#\@\!\`\^\%\=\+\-]+$")])],
    //不能将void 类型分配给 validators equalto()要有返回值
    re_password: ['',Validators.compose([Validators.required,this.equalto('password')])]
  });
  that.phoneNum = that.sendCodeForm.controls['phonNum'];
  that.validatorCode = that.sendCodeForm.controls['validatorCode'];
  that.nickname = that.sendCodeForm.controls['nickName'];
  this.password = this.updatePwdForm.controls['password'];
  this.re_password = this.updatePwdForm.controls['re_password'];
  this.callback = this.navParams.get('callback');
  }

  ngOnInit () {
    this.token = localStorage.getItem("token");
    //没有第三方userId，（只有第三方登录和微信授权之后会有sessionId）
    this.sessionId = localStorage.getItem("sessionId");
    this.visitorId = localStorage.getItem("visitorId");
    this.siteId = localStorage.get("siteId");
  }

  ionviewWillEnter() {
    console.log("进入****ionicviewEnter")
    this.gender = localStorage.getItem("gender");
    this.avatarUrl = localStorage.getItem("avatarUrl");
    if(!this.gender){
      this.gender = "/assets/images/login/man.png";
    }
    if(!this.avatarUrl) {
      this.avatarUrl = "/assets/images/defaultAv.png"
    }
    // 获取运行环境
    var ua = navigator.userAgent.toLowerCase();
    this.isWeixin = ua.indexOf("micromessenger") != -1 ? true : false;

  }

  ionViewDidEnter() {
    var that = this;
    var file = document.getElementById("files");
    if(file) {
      file.addEventListener("change", function(e){
        let files = (<HTMLInputElement>file).files;
        if(!files) {
          console.log()
          return;
        }
        that.fileChange(files);
      });
    }
  }

  //输入框文本变动调用
  fileChange(files) {
    var that = this;
    if(typeof FileReader !== 'undefined') {//验证浏览器是否支持图片预览
      var regexImage = /^image\//;//是否有 img
      var _img = document.getElementById('avatar');
      var reader = new FileReader();
      var file= files[0];
      if(file) {
        if(regexImage.test(file.type)) {
          // 设置读取结束的回调函数，
          reader.onload = function(data) {
            if(file.size > 512000) {//文件大小超过512
              var _image = new Image();
              _image.src = (<FileReader>data.target).result;
              _image.onload = function() {
                _image["src"] = FileUtils.compress(_image);
                that.avatarUrl = _img["src"];
              };
            }else{//文件大小不超过 512
              _img["src"] = (<FileReader>data.target).result;
            }
          };
          //上传图片
          reader.readAsDataURL(file);
        }
      }
    }else {
      alert("亲，你的浏览器该升级了")
      return;
    }
  } 

  ionViewDidLoad() {
    console.log("进入****didLoad")
    
  }

  // 校验第二次密码是否相同
  equalto(field_name): ValidatorFn {
    // key 必须为 string 或 number
    return(control: AbstractControl): {[key: string]:any} => {
      let input = control.value;
      let isValid = control.root.value[field_name] == input;
      if(isValid) {
        return {'equalTo': {isValid}};
      }else{
        return null;
      }
    }; 
  }



}

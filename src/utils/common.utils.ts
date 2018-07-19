export class CommonUtils {

    //获取设备高度
    public static getWindowHeight() {
      return window.screen.height;
    }
    //获取设备宽度
    public static getWindowWidth() {
      return window.screen.width;
    }
  
  
    public static getUrlParam(search,name) {
      var reg = new RegExp('(^|&|/?)' + name + '=([^&]*)(&|$)');
      var r = search.substr(1).match(reg);
      if (r != null) {
        return decodeURI(r[2]);
      }
      return null;
    }
  
    //判断是否是微信浏览器
    public static is_weixn() {
      var ua = navigator.userAgent;
      if (ua.indexOf('MicroMessenger') > -1) {
        return true;
      } else {
        return false;
      }
    }
  
    public static versions() {
      var u = navigator.userAgent;   //app = navigator.appVersion
      return {//移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
      };
    };
  
    public static toQueryString(obj) {
      let result = [];
      for (let key in obj) {
        key = encodeURIComponent(key);
        let values = obj[key];
        if (values && values.constructor == Array) {
          let queryValues = [];
          for (let i = 0, len = values.length, value; i < len; i++) {
            value = values[i];
            queryValues.push(this.toQueryPair(key, value));
          }
          result = result.concat(queryValues);
        } else {
          result.push(this.toQueryPair(key, values));
        }
      }
      return result.join('&');
    }
  
    public static toQueryPair(key, value) {
      if (typeof value == 'undefined') {
        return key;
      }
      return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }
  
    /**
     * token过期弹出框
     * @param alertCtrl
     * @param navCtrl
     * @param siginPage
     */
    public static tokenExpired(alertCtrl,navCtrl,siginPage){
      let successAlert = alertCtrl.create({
        title: '提示',
        message: '系统检测到您长时间未登录，为确保您的账号安全，请重新登录后再使用，谢谢！',
        buttons: [
          {
            text: '好的',
            handler: () => {
              localStorage.removeItem("customerId");
              localStorage.removeItem("customerToken");
              navCtrl.push(siginPage);
            }
          }
        ]
      });
      successAlert.present();
    }
  
    /**
     * 登录modal页面
     * @param modalCtrl
     * @param siginPage
     */
    public static popupSigninPage(modalCtrl,page,prama){
      let siginPageToast = modalCtrl.create(page,prama);
      siginPageToast.onDidDismiss(data => {
      });
      siginPageToast.present();
    }
  
  }
  
import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config';

@Injectable()
export class CustomerServiceProvider {

  constructor(
              public http: Http,
              
            ) {
    console.log('Hello CustomerServiceProvider Provider');
  }
/**
 * 微信环境注册
 * @Pitcher
 *
 * @param {*} token
 * @param {*} phon
 * @param {*} sessionId
 * @param {*} nickName
 * @param {*} siteId
 * @param {*} code
 * @param {*} avatarUrl
 * @param {*} isNeedCode
 * @returns
 * @memberof CustomerServiceProvider
 */
signup(token, phone, sessionId, nickName, siteId, code, avatarUrl, isNeedCode) {//用户注册
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() +"/customer/signup?access_token=" + token + '&phoe=' + phone + '&sessionId=' + sessionId  + '&nickName=' + nickName + '&siteId='+ siteId + '&code=' + code + '&avatarUrl=' + avatarUrl + '&isNeedCode=' + isNeedCode, options)
                    .map(res => res.json());
  }

  /**
   * 手机验证码登录
   *  @Pitcher
   * @param {any} token 
   * @param {any} phone 
   * @param {any} code 
   * @param {any} sessionId 
   * @param {any} vistorId 
   * @param {any} isNeedCode 
   * @returns 
   * @memberof CustomerServiceProvider
   */
  phoneLogin(token, phone, code, sessionId, vistorId, isNeedCode) {//手机验证码登录
    let headers = new Headers({'Count-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/customer/login/phoneLogin?access_token=" + token + '&phone=' + phone + '&code=' + code + '&sessionId=' + sessionId + '&vistorId=' + vistorId + '&isNeedCode=' + isNeedCode, options)
          .map(res => res.json());
  }

  /**
   * 登录成功后再次查询顾客基本信息
   * @pitcher
   * 
   * @param {any} customerId 
   * @param {any} token 
   * @returns 
   * @memberof CustomerServiceProvider
   */
  getUserCenterHttp(customerId, token) {//用户基本信息
    return this.http.get(AppConfig.apiUrl() + "/customer/detail/" + customerId + "?access_token=" + token)
                    .map(res =>res.json());
  }

  activityLuckyDraw(token, customerId) {//抽奖
    let  headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(AppConfig.apiUrl() + "/activityLuckyDraw/findSurplusTimes?access_token=" + token + "&customerId=" + customerId, options)
                    .map(res => res.json())
  }

  /**
   * 获取用户头像
   * @Picther 
   *
   * @param {*} token
   * @param {*} customerId
   * @param {*} serverIds
   * @returns
   * @memberof CustomerServiceProvider
   */
  uploadAvatar(token,customerId,serverIds){//获取用户头像
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/customer/uploadAvatar?access_token="+token+"&customerId="+customerId+"&serverIds="+serverIds, options)
      .map(res => res.json());
  }

  /**
   * 修改 nickName
   * @Picther
   *
   * @param {*} token
   * @param {*} customerId
   * @param {*} nickName
   * @returns
   * @memberof CustomerServiceProvider
   */
  updateNickName(token, customerId, nickName) {//修改昵称
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/customer/updateNickName?access_token=" + token + '&customerId=' + customerId + '&nickName=' + nickName, options)
                    .map(res => res.json());
  }

  /**
   * 找回密码请求
   * @Pitcher
   *
   * @param {*} token
   * @param {*} phone
   * @param {*} code
   * @returns
   * @memberof CustomerServiceProvider
   */
  forgetCheckPhone(token, phone, code) {
    let headers = new Headers({'content-Type': 'splication/x-www-form-uelencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/customer/forget/checkPhone?access_token=" + token + '&phone=' + phone + '&code=' +code,options)
                    .map(res => res.json());
  }

  /**
   * 修改密码请求
   *@Pitcher
   *
   * @param {*} token
   * @param {*} phone
   * @param {*} newPassword
   * @returns
   * @memberof CustomerServiceProvider
   */
  updatePwd(token, phone, newPassword) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/customer/forget/updatePwd?access_token=" + token + '&phone=' + phone + '&newPassword=' + newPassword, options)
      .map(res => res.json());
  }

  /**
   * 绑定手机请求
   * @Pitcher
   *
   * @param {*} token
   * @param {*} customerId
   * @param {*} phone
   * @param {*} code
   * @returns
   * @memberof CustomerServiceProvider
   */
  bindPhone(token, customerId, phone, code) {
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/cudtomer/bindPhone?access_token=" + token + '&customerId=' + customerId + '&phone=' + phone + '&code=' + code,options)
                    .map(res => res.json());
  }
 
}

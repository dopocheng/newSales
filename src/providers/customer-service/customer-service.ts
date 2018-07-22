import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config';
// import 'rxjs/add/operator/map';

/*
  Generated class for the CustomerServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomerServiceProvider {

  constructor(
              public http: Http,
              
            ) {
    console.log('Hello CustomerServiceProvider Provider');
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
  phoneLogin(token, phone, code, sessionId, vistorId, isNeedCode) {
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
  getUserCenterHttp(customerId, token) {
    return this.http.get(AppConfig.apiUrl() + "/customer/detail/" + customerId + "?access_token=" + token)
                    .map(res =>res.json());
  }

  activityLuckyDraw(token, customerId) {//抽奖
    let  headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.get(AppConfig.apiUrl() + "/activityLuckyDraw/findSurplusTimes?access_token=" + token + "&customerId=" + customerId, options)
                    .map(res => res.json())
  }

}

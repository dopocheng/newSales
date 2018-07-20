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

  phoneLogin(token, phone, code, sessionId, vistorId, isNeedCode) {
    let headers = new Headers({'Count-Type': 'application-x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/customer/login/phoneLogin?access_token" + token + '&phone=' + phone + '&code=' + code + '&sessionId=' + sessionId + '&vistorId=' + vistorId + '&isNeedCode=' + isNeedCode, options)
          .map(res => res.json());
  }

}

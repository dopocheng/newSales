import { Http, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../../app/app.config'
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class SendSmsServiceProvider {

  constructor(public http: Http) {
    console.log('Hello SendSmsServiceProvider Provider');
  }

  sendValidateCode(token, phone, template, platFormFlag, nationCode) {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencode' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(AppConfig.apiUrl() + "/sms/sendSms?access_token=" + token + '&phone=' + phone + '&template=' + template + '&platFormFlag=' + platFormFlag + '&nationCode=' + nationCode, options)
      .map(res => res.json());
  }
}

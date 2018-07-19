import { Http, RequestOptions, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config';

/*
  Generated class for the TokenServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenServiceProvider {
  grant_type = "client_credentials";
  client_id = "guest00001";
  client_secret = "sd5ga7b0hz864l2c3";
  constructor(public http: Http) {
    console.log('Hello TokenServiceProvider Provider');
  }
  // 获取随机的token
  getEnjoyHomeToken() {
    let headers = new Headers({'Content-Type': 'application/x-ww-form-urlencode'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.tokenUrl() + "?grant_type=" + this.grant_type + "&client_id=" + this.client_id + "&client_secret=" + this.client_secret, options)
                    .map(res => res.json());
  }

}

import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config'
// import 'rxjs/add/operator/map';

/*
  Generated class for the UserinfoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserinfoServiceProvider {

  constructor(
              public http: Http
            ) {
    console.log('Hello UserinfoServiceProvider Provider');
  }

  getBrowerInfo(code, state, userAgent, descn, token) {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/wx/getSessionForWeb?access_token=" + token + "&code" + code + "&state=" + state, options)
                .map(res => res.json());
  }

}

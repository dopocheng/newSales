import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import {AppConfig} from './../../app/app.config';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserinfoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserinfoServiceProvider {

  constructor(public http: Http) {
  }

  getUserInfo(code,state,token) {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(AppConfig.apiUrl() + "/wx/getSessionForWeb?access_token=" + token+"&code="+code+"&state="+state,options)
      .map(res => res.json());
  }

  getSellerInfo(workNumber,token){
    return this.http.get(AppConfig.apiUrl() + "/users/staffNumber?staffNumber="+workNumber+ "&access_token=" + token)
      .map(res => res.json());
  }

  bindUser(workNumber,sessionId,token){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(AppConfig.apiUrl() + "/socialUsers/bindUser?access_token=" + token+"&workNumber="+workNumber+"&socialUserId="+sessionId,options)
      .map(res => res.json());
  }

  getBrowerInfo(code,state,userAgent,descn,token){
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(AppConfig.apiUrl() + "/logs/logForUserAgent?code="+code +"&state=" + state  + "&userAgent=" + userAgent   +"&access_token=" + token + "&descn=" + descn,options)
      .map(res => res.json());
  }

}

import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config';


@Injectable()
export class MessageServiceProvider {

  constructor(
              public http: Http,
  ) {
    console.log('Hello MessageServiceProvider Provider');
  }

  readMessage( token, messageId) {
    let headers  = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/message/readMessage/" + messageId + "?access_token=" + token, options)
                    .map(mes => mes.json());
  }

}
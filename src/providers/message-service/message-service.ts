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
/**
 * messageId 查询信息
 * 
 * @param {any} token 
 * @param {any} messageId 
 * @returns 
 * @memberof MessageServiceProvider
 */
readMessage( token, messageId) {
    let headers  = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(AppConfig.apiUrl() + "/message/readMessage/" + messageId + "?access_token=" + token, options)
                    .map(mes => mes.json());
  }

  getUnreadMessages(token, customerId) {
    return this.http.get(AppConfig.apiUrl() + "/message/unReadCount?access_token=" + token + '&customerId=' +customerId)
                    .map(res => res.json());
  }

  getMessagesByTypeAndCustomerId(token, type, customerId, pageSize, index){
    return this.http.get(AppConfig.apiUrl() + "/message/getByCustomerAndType?access_token=" + token + "&type=" + type + "&customerId=" + customerId + "&pageSize=" + pageSize + "&index=" + index)
                    .map(res => res.json());
  }

}

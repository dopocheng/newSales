import { Http, RequestOptions, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config';

/**
 * 请求 API
 * @Pitcher
 * @export
 * @class TokenServiceProvider
 */
@Injectable()
export class TokenServiceProvider {
  grant_type = "client_credentials";
  client_id = "guest00001";
  client_secret = "sd5ga7b0hz864l2c3";
  constructor(
              public http: Http
            ) {
              console.log('进入 => TokenServiceProvider Provider');
            }

  // 获取后台随机的token
  getEnjoyHomeToken() {//postman
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});//数据被编码为:名称/值对标准的编码格式。上传文件使用:multipart/form-data.
    let options = new RequestOptions({headers: headers});//请求选项
    return this.http.post(AppConfig.tokenUrl() + "?grant_type=" + this.grant_type + "&client_id=" + this.client_id + "&client_secret=" + this.client_secret, options)
                    .map(res => res.json());
  }

}

import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { AppConfig } from '../../app/app.config';
import 'rxjs/add/operator/map';

/*
  Generated class for the UnpaidOrderServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UnpaidOrderServiceProvider {

  constructor(
              public http: Http
  ) {
    console.log('Hello UnpaidOrderServiceProvider Provider');
  }

  //获取未支付订单
  getUnpaidAllOrderList(customerId,token) {
    return this.http.get(AppConfig.apiUrl() + "/reservations/findReservationByStatus?customerId=" + customerId + "&status=0&access_token=" + token)
      .map(res => res.json());
  }

}

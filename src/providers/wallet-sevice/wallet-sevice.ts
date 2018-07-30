import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config';

@Injectable()
export class WalletSeviceProvider {

  constructor(
              public http: Http
  ) {
    console.log('Hello WalletSeviceProvider Provider');
  }

  getdrawCashAndRebate( token, customerId) {
    return this.http.get( AppConfig.apiUrl() + "/paymaxPay/getWithdrawCashAndRebate?access_token=" + token + '&startTime=2017-12-21 00:00:00&endTime=2117-12-21 00:00:00'  + '&customerId=' + customerId )
                    .map(res => res.json());
  }
}

import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../app/app.config';



@Injectable()
export class RecommentListServiceProvider {

  constructor(
              public http: Http
  ) {
    console.log('Hello RecommentListServiceProvider Provider');
  }

  getInvitationInfo(token,invitationId){
    return this.http.get(AppConfig.apiUrl() + "/invitation/"+invitationId + "?access_token=" + token)
      .map(res => res.json());
  }

}

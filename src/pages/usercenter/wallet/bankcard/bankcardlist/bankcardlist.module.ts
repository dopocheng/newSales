import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankcardlistPage } from './bankcardlist';

@NgModule({
  declarations: [
    BankcardlistPage,
  ],
  imports: [
    IonicPageModule.forChild(BankcardlistPage),
  ],
})
export class BankcardlistPageModule {}

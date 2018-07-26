import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticelistPage } from './noticelist';

@NgModule({
  declarations: [
    NoticelistPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticelistPage),
  ],
})
export class NoticelistPageModule {}

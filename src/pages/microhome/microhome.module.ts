import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MicrohomePage } from './microhome';

@NgModule({
  declarations: [
    MicrohomePage,
  ],
  imports: [
    IonicPageModule.forChild(MicrohomePage),
  ],
})
export class MicrohomePageModule {}

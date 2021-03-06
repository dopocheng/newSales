import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import * as ionicGalleryModal from 'ionic-gallery-modal';

import { UserCenterPage } from '../pages/usercenter/usercenter';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/login/signin/signin';
import { PreviewpagePage } from '../pages/microhome/previewpage/previewpage';
import { UnpaidorderPage } from '../pages/usercenter/unpaidorder/unpaidorder';
import { EditmessagePage } from '../pages/usercenter/editmessage/editmessage';
import { SignupPage } from '../pages/login/signup/signup';
import { EditusernamePage } from '../pages/usercenter/editmessage/editusername/editusername';
import { EdituserpasswordPage } from '../pages/usercenter/editmessage/edituserpassword/edituserpassword';
import { BindphonePage }  from '../pages/usercenter/editmessage/bindphone/bindphone';
import { NoticelistPage }   from '../pages/usercenter/noticelist/noticelist';
import { MessagelistPage } from '../pages/usercenter/noticelist/messagelist/messagelist';
import { CreatmerchantsPage } from '../pages/creatmerchants/creatmerchants';
import { WalletPage } from '../pages/usercenter/wallet/wallet';
import { BankcardPage } from '../pages/usercenter/wallet/bankcard/bankcard';
import { WithdrawalPage } from '../pages/usercenter/wallet/withdrawal/withdrawal'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NgxQRCodeModule } from 'ngx-qrcode3'
import { SendSmsServiceProvider } from '../providers/send-sms-service/send-sms-service';
import { TokenServiceProvider } from '../providers/token-service/token-service';
import { UserinfoServiceProvider } from '../providers/userinfo-service/userinfo-service';
import { CustomerServiceProvider } from '../providers/customer-service/customer-service';
import { MessageServiceProvider } from '../providers/message-service/message-service';
import { UnpaidOrderServiceProvider } from '../providers/unpaid-order-service/unpaid-order-service';
import { RecommentListServiceProvider } from '../providers/recomment-list-service/recomment-list-service';
import { WalletSeviceProvider } from '../providers/wallet-sevice/wallet-sevice';
 
@NgModule({
  declarations: [//新建页面加 和modal
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    UserCenterPage,//用户中心
    SigninPage,
    PreviewpagePage,
    UnpaidorderPage,
    EditmessagePage,
    SignupPage,
    EditusernamePage,
    EdituserpasswordPage,
    BindphonePage,
    NoticelistPage,
    MessagelistPage,
    CreatmerchantsPage,
    WalletPage,
    BankcardPage,
    WithdrawalPage
    
  ],
  imports: [  //第三方 module
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    NgxQRCodeModule,
    ionicGalleryModal.GalleryModalModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [//新建页面加 和modal
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    UserCenterPage,
    SigninPage,
    PreviewpagePage,
    UnpaidorderPage,
    EditmessagePage,
    SignupPage,
    EditusernamePage,
    EdituserpasswordPage,
    BindphonePage,
    NoticelistPage,
    MessagelistPage,
    CreatmerchantsPage,
    WalletPage,
    BankcardPage,
    WithdrawalPage
  ],
  providers: [//新建 provider
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SendSmsServiceProvider,
    TokenServiceProvider,
    UserinfoServiceProvider,
    CustomerServiceProvider,
    UserinfoServiceProvider,
    MessageServiceProvider,
    UnpaidOrderServiceProvider,
    RecommentListServiceProvider,
    WalletSeviceProvider
  ]
})
export class AppModule {}

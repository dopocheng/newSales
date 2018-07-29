import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MessageServiceProvider } from '../../../../providers/message-service/message-service';
import { RecommentListServiceProvider } from '../../../../providers/recomment-list-service/recomment-list-service'
import { ErrorUtils } from '../../../../utils/error.utils';

import { WalletPage } from '../../wallet/wallet'
import { SigninPage } from '../../../login/signin/signin';
import { CreatmerchantsPage } from '../../../../pages/creatmerchants/creatmerchants';

@IonicPage()
@Component({
  selector: 'page-messagelist',
  templateUrl: 'messagelist.html',
})
export class MessagelistPage implements OnInit {
  messageType: any;
  pageTitle: string;
  token: string;
  customerId: string;
  customerToken: string;
  messages: any = [];
  currentPage: number = 1;
  pageSize: number = 10;


  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public messageService: MessageServiceProvider,
              public alerCtrl: AlertController,
              public recommentListService:RecommentListServiceProvider
  ) {
    this.messageType = this.navParams.get("messageType");
    if(this.messageType == 0) {
      this.pageTitle = "系统消息";
    }else if(this.messageType == 1) {
      this.messageType = "个人尊享特价";
    }else if (this.messageType == 2) {
      this.pageTitle = "我的资产";
    }
  }

  ngOnInit() {
    var that = this;
    that.token = localStorage.getItem("token");
    that.customerId = localStorage.getItem("customerId");
  }

  ionViewWillEnter() {
    var that = this;
    that.customerToken = localStorage.getItem("customerToken");
    that.messageService.getMessagesByTypeAndCustomerId(that.token, that.messageType, that.customerId, 10, 0).subscribe(res => {
      console.error("messageListPage");
      console.info(res);
      if(res && res.errorCode ==0) {
        that.messages = res.data;
      }
    },error => {
      ErrorUtils.handleError(error, that.alerCtrl, that.navCtrl, SigninPage);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagelistPage');
  }

  //下拉刷新
  doInfinite(refresher) {
    var that = this;
    that.currentPage++;
    console.error("currentPage= " + that.currentPage);
    let index = (that.currentPage - 1) * that.pageSize;
    that.messageService.getMessagesByTypeAndCustomerId(that.token, that.messageType, that.customerId, that.pageSize, index).subscribe(res => {
      console.error("doInfinite");
      console.info(res);
      if(res && res.errorCode == 0){
        let infinite = res.data;
        if(infinite && infinite.length > 0) {
          for(let i =0; i < infinite; i++) {
            that.messages.push(infinite(i));
          }
        } else {
          that.currentPage--;
        }
      }setTimeout(() => {
        refresher.complete();
      },1000);
    },error => {
      ErrorUtils.handleError(error,that.alerCtrl, that.navCtrl, SigninPage);
    })
  }

  clickMessage(message) {
    var that = this;
    that.customerToken = localStorage.getItem("customerToken");
    if (message.type == 0) {//邀请页面
      that.recommentListService.getInvitationInfo(that.customerToken, message.inviationId).subscribe(res => {
        //console.log(res);
        if (res && res.errorCode == 0) {
          let invitation = res.data;
          if (invitation.type == 0) { //商户创建邀请
            this.navCtrl.push(CreatmerchantsPage, {
              readStatus:message.readStatus,
              invitationAccept: invitation.accept,
              siteName: invitation.site.name,
              customerPhone:invitation.customer.phone,
              messageId: message.id,
            });
          } else if (invitation.type == 1 ) { //内部推广人 and 外部推广人
            this.navCtrl.push(CreatmerchantsPage, {//InvitesalesPage
              readStatus:message.readStatus,
              invitationAccept: invitation.accept,
              messageId: message.id,
              brandId:invitation.brand.id,
              invitationID:invitation.id,
              brandName:invitation.brand.brandName,

            });
          }else if(invitation.type == 2 || invitation.type == 5){
            console.log("数据详情",invitation,message);
            var company;
            if(invitation.extEnterprise&&invitation.extEnterprise.name){
              company = invitation.extEnterprise.name
            }else {
              company = ''
            }
            this.navCtrl.push(CreatmerchantsPage, {//OutsidesalesPage
              readStatus:message.readStatus,
              invitationAccept: invitation.accept,
              messageId: message.id,
              invitationID:invitation.id,
              brandName:invitation.brand.brandName,
              company:company
            });

          }

          else if (invitation.type == 3) { //邀请用户加入家
            this.navCtrl.push(CreatmerchantsPage, {//InvithomememberPage
              invitationAccept: invitation.accept,
              readStatus: message.readStatus,
              messageId:message.id,
              invitationId:invitation.id,
              inTite: invitation.title,
              inRemark: invitation.remarks,
              inCreatTime: invitation.createTime,
            });
          }

          else {//其他邀请

          }
        }
      }, error => {
        ErrorUtils.handleError(error,that.alerCtrl, that.navCtrl, SigninPage);
      });
    } else if (message.type == 1) {//跳转成单推广页面 PromotionsPage
      that.navCtrl.push(CreatmerchantsPage, {promotionListId: message.promotionId, messageId: message.id});
    } else if (message.type == 2) {
      //
      if(message.messageTitle=="卡券被领取"){
        this.navCtrl.push(CreatmerchantsPage,{//MycardPage
          readStatus: message.readStatus,
          messageId:message.id,
        });

      }else if(message.messageTitle=="领取卡券"){
        this.navCtrl.push(CreatmerchantsPage,{//FriendcardPage
          from:"展示",
          readStatus: message.readStatus,
          messageId:message.id,

        });

      }

    }else if (message.type == 4) { //领卡
      if(message.messageTitle=='首页活动分享通知'){
        this.navCtrl.push(CreatmerchantsPage, {//PurchasevipPage
          saler: null,
          fromType:1,
          readStatus: message.readStatus,
          messageId:message.id,
          })
      }else {
        this.navCtrl.push(CreatmerchantsPage, {//NotificationlistPage
          readStatus: message.readStatus,
          messageId:message.id,
        })
      }


    }
    else if (message.type == 5) { //返利
      this.navCtrl.push(WalletPage, {//WalletPage
        readStatus: message.readStatus,
        messageId:message.id,
      });
    }
    else if (message.type == 6) { //下单
      /*this.navCtrl.push(WalletPage, {
        message: message
      });*/
      this.navCtrl.push(CreatmerchantsPage, {//UnpaidorderPage
        orderType: "已支付订单",
        readStatus: message.readStatus,
        messageId:message.id,
      });
    }
  }

}

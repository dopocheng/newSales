import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular'
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = ContactPage;
  tab5Root = ContactPage;

  constructor() {

  }
}

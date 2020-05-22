import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RecordService } from './services/record.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    private recordService: RecordService, 
    private storageService: StorageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    if (!this.storageService.isEmpty()) {
      if (this.storageService.exist('records') && this.storageService.exist('countries')) {}
      else {
        this.storageService.clear();
        this.recordService.getAllRecords();
        this.recordService.getAllCountries(); 
      }
    } 
    else {
      this.recordService.getAllRecords();
      this.recordService.getAllCountries(); 
    }   
  }
}

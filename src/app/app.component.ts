import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { InicioPage } from "../pages/inicio/inicio";
import { PerfilesPage } from '../pages/perfiles/perfiles';
import { ContactoPage } from '../pages/contacto/contacto';
import { AcercaPage } from '../pages/acerca/acerca';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AlertController } from 'ionic-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;
  public rootPage: any;
  public pages: Array<{ titulo: string, component: any, icon: string }>;

  constructor(
    platform:     Platform,
    statusBar:    StatusBar,
    splashScreen: SplashScreen,
    private push: Push,
    private alertCtrl: AlertController
  ) {

    this.rootPage = InicioPage;
    this.pages = [
      { titulo: 'Inicio',          component: InicioPage,   icon: 'home'},
      { titulo: 'Perfiles',        component: PerfilesPage, icon: 'person'},
      { titulo: 'Contacto',        component: ContactoPage, icon: 'mail'},
      { titulo: 'Acerca de',       component: AcercaPage,   icon: 'information-circle'}
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.pushInit();
      splashScreen.hide();
    });
  }

  goToPage(page){
    this.nav.setRoot(page);
  }

  pushInit(){
    const options: PushOptions = {
      android: {
        senderID: '409972097467'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      },
      windows: {},
      browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
   };
   
   const pushObject: PushObject = this.push.init(options);

   pushObject.on('notification').subscribe((notification: any) => {
     if (notification.additionalData.foreground) {
       let youralert = this.alertCtrl.create({
         title: 'Nueva Notificación',
         message: notification.message,
         buttons: ['Aceptar']
       });
       youralert.present();
     }
   });
 
   pushObject.on('registration').subscribe((registration: any) => {
      //do whatever you want with the registration ID
   });
 
   pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
 
   }

}

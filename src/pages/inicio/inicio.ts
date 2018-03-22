import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { PlaylistsPage } from '../playlists/playlists';
import { DeezerService } from '../../providers/deezer-service';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/observable/merge';


@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
  providers: [ DeezerService ]
})
export class InicioPage {

  // propiedades
  public users: any;
  public loader: any;
  public listasDestacadas: any;

  constructor(
    public navCtrl:   NavController,
    public navParams: NavParams,
    public ds:          DeezerService,
    public loadingCtrl: LoadingController,
  ){
    this.users = [];
    this.listasDestacadas = [];
    this.loader = this.loadingCtrl.create();
  }

  // metodos
  goToPlaylist(user) {
    this.navCtrl.push(PlaylistsPage, { user: user });
  }

  // onInits
  ionViewDidLoad() {

    this.loader.present();

    this.ds.getListasDestacadas().subscribe(
      data  => this.listasDestacadas.push(data.data),
      error => console.log(error)
    );
    console.log(this.listasDestacadas);

    this.ds.getUsers().subscribe( usersIDs => {
      let sources = usersIDs.map( userID => this.ds.getUserDetail(userID) );
      Observable.merge(...sources).subscribe(
        data  => this.users.push(data),
        error => console.log(error),
        ()    => this.loader.dismiss()
      );
      console.log(this.users);
    });

    // this.ds.getListasDestacadas().subscribe( data => {
    //   console.log(data)
    // });
  }

}

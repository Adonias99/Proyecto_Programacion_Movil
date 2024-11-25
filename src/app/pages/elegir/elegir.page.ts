import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-elegir',
  templateUrl: './elegir.page.html',
  styleUrls: ['./elegir.page.scss'],
})
export class ElegirPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  login(){
    this.navCtrl.navigateForward(['/login']);
  }

  login2(){
    this.navCtrl.navigateForward(['/login2']);
  }
  registrar(){
    this.navCtrl.navigateForward(['/registrarse']);
  }

}

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss'],
  standalone: true, 
  imports: [IonicModule], 
})
export class ComponentComponent {
  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  cerrar_sesion() {
    this.afAuth.signOut()
      .then(() => {
        this.navCtrl.navigateForward(['/elegir']);
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }
}

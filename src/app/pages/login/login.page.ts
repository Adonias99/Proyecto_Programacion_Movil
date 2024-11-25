import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario: string = ''; // Email
  contrasena: string = '';
  rol: string = 'conductor'; // Establecer "conductor" como valor por defecto

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private CrudServ: CrudfirebaseService) { }

  validar() {
    this.CrudServ.iniciarSesion(this.usuario, this.contrasena)
      .then((user) => {
        // Navegar a la página principal después de iniciar sesión
        if (this.rol === 'conductor') {
          this.navCtrl.navigateForward(['/home']); // Navegar a la página principal del conductor
        } else if (this.rol === 'pasajero') {
          this.navCtrl.navigateForward(['/home2']); // Navegar a la página principal del pasajero
        }
      })
      .catch((error) => {
        console.error("Error de inicio de sesión: ", error);
        this.presentAlert(error.message);
      });
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Login',
      subHeader: 'Validación usuario',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();

    // Automatizar el clic en el botón "OK" después de 500ms
    setTimeout(() => {
      const okButton = document.querySelector('ion-alert button') as HTMLButtonElement;
      if (okButton) {
        okButton.click(); // Clic en el botón OK
      }
    }, 500);  // Ajusta el tiempo según sea necesario
  }

  restablecer() {
    this.navCtrl.navigateForward(['/restablecer', this.usuario]);
  }
}

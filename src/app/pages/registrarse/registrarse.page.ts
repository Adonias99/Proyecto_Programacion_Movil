import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { CrudfirebaseService, Usuario } from 'src/app/servicio/crudfirebase.service';

declare var grecaptcha: any;

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {
  nuevo_Usuario: Usuario = { correo: '', nombreUsuario: '', contrasenna: '', nombreApellido: '' };
  confirmacionContrasenna: string = ''; 
  recaptchaResponse: string | undefined;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private CrudServ: CrudfirebaseService) {}

  ngOnInit() {
    this.loadRecaptcha();
  }

  registrar() {
    if (!this.recaptchaResponse) {
      this.presentAlert('Registro Fallido', 'Por favor, verifica que no eres un robot.');
      return;
    }
    if (this.nuevo_Usuario.contrasenna !== this.confirmacionContrasenna) {
      this.presentAlert('Registro Fallido', 'Las contraseñas no coinciden.');
      return;
    }


    this.CrudServ.crearUsuario(this.nuevo_Usuario).then(() => {
      this.presentAlert('Registro Exitoso', 'Cuenta creada correctamente.');
      this.navCtrl.navigateForward(['/elegir']);
    })
    .catch((err: any) => {
      console.log("Error", err);
      this.presentAlert('Error', 'Hubo un problema al crear la cuenta.');
    });
  }

  loadRecaptcha() {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.render('recaptcha', {
        'sitekey': '6LemLGQqAAAAAP4EU55TZ4A5PkG-oAIHdXdQ7kJW',
        'callback': (response: string) => this.onCaptchaResolved(response)
      });
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  onCaptchaResolved(captchaResponse: string) {
    this.recaptchaResponse = captchaResponse;
  }
}

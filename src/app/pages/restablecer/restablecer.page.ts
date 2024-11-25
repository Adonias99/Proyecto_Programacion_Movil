import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage implements OnInit {
  usuario: string = '';

  constructor(
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async continuar() {
    try {
      // Enviar el correo de restablecimiento de contraseña
      await this.auth.sendPasswordResetEmail(this.usuario);
      this.mostrarAlerta('Éxito', 'Se ha enviado un correo para restablecer la contraseña.');
      this.navCtrl.navigateForward(['/login']); // Redirigir a la página de inicio de sesión
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      this.mostrarAlerta('Error', 'No se pudo enviar el correo. Verifica tu dirección de correo.');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}

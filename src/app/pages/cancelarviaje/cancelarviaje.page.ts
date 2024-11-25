import { Component, OnInit } from '@angular/core';
import { Viaje } from 'src/app/model/viajes';
import { NavController, AlertController } from '@ionic/angular'; // Importa AlertController
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-cancelarviaje',
  templateUrl: './cancelarviaje.page.html',
  styleUrls: ['./cancelarviaje.page.scss'],
})
export class CancelarviajePage implements OnInit {

  viajes: Viaje[] = [];
  userId: string | null = null;

  constructor(
    private crudServ: CrudfirebaseService,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private alertCtrl: AlertController // Inyecta AlertController
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;  
        this.cargarViajes();  
      }
    });
  }

  cargarViajes() {
    this.crudServ.obtenerViajes().subscribe(viajes => {
      this.viajes = viajes.filter(viaje => viaje.userId === this.userId);  
      console.log("Viajes Cargados:", this.viajes);
    });
  }

  /*async confirmarEliminacion(id: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Anulación',
      message: '¿Estás seguro de que deseas cancelar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Manejar la acción de cancelación
            console.log('Eliminación cancelada');
          }
        }, {
          text: 'Anular',
          handler: () => {
            this.eliminarViaje(id);
          }
        }
      ]
    });

    await alert.present();
  }*/

  eliminarViaje(id: any) {
    this.crudServ.eliminarViajes(id).then(() => {
      alert("Viaje Anulado");
      this.cargarViajes();  
    }).catch((err) => {
      console.log(err);
    });
  }

  qr() {
    this.navCtrl.navigateForward(['/qr']);
  }
}

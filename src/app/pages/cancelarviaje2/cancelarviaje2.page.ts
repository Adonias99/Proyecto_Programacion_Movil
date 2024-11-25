import { Component, OnInit, OnDestroy } from '@angular/core';
import { Viaje } from 'src/app/model/viajes';  
import { NavController, AlertController } from '@ionic/angular';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cancelarviaje2',
  templateUrl: './cancelarviaje2.page.html',
  styleUrls: ['./cancelarviaje2.page.scss'],
})
export class Cancelarviaje2Page implements OnInit, OnDestroy {
  viajes: Viaje[] = [];
  userId: string | null = null;
  private authSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private crudServ: CrudfirebaseService,
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.authSubscription = this.auth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid; 
        this.cargarViajes(); 
      }
    });
  }

  cargarViajes() {
    this.crudServ.obtenerTodosLosViajes().subscribe(
      viajes => {
        this.viajes = viajes.filter(viaje => viaje.usuariosPagantes?.includes(this.userId!));
        console.log("Viajes Cargados:", this.viajes);
      },
      error => {
        console.error("Error al cargar viajes:", error);
      }
    );
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async anularViaje(viaje: Viaje) {
    if (!viaje.id || !this.userId) {
      console.error("El viaje o el ID del usuario no están definidos");
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar Anulación',
      message: `¿Estás seguro de que deseas anular el viaje a ${viaje.destino}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Acción de anulación cancelada');
          }
        }, {
          text: 'Anular',
          handler: () => {
            // Quitar el ID del usuario de usuariosPagantes
            viaje.usuariosPagantes = viaje.usuariosPagantes?.filter(id => id !== this.userId);

            // Aumentar la capacidad del viaje
            const nuevaCapacidad = (viaje.capacidad ?? 0) + 1;

            // Actualizar el viaje en Firestore
            if (viaje.id) {
              this.crudServ.actualizarViaje(viaje.id, { usuariosPagantes: viaje.usuariosPagantes, capacidad: nuevaCapacidad })
                .then(() => {
                  console.log("Viaje Anulado:", viaje);
                  this.mostrarAlerta('Éxito', 'El viaje ha sido anulado con éxito.');
                  this.cargarViajes(); // Recargar viajes para reflejar cambios
                })
                .catch(error => {
                  console.error("Error al anular el viaje:", error);
                  this.mostrarAlerta('Error', 'No se pudo anular el viaje.');
                });
            } else {
              console.error("El ID del viaje no está definido");
            }
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  qr() {
    this.navCtrl.navigateForward(['/qr']);
  }
}

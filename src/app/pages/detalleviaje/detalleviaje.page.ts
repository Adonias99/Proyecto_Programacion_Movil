import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Viaje } from 'src/app/model/viajes';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DataService } from 'src/app/servicio/data.service';
import { take } from 'rxjs/operators';

declare var paypal; 

@Component({
  selector: 'app-detalleviaje',
  templateUrl: './detalleviaje.page.html',
  styleUrls: ['./detalleviaje.page.scss'],
})
export class DetalleviajePage implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  viajes: Viaje[] = [];
  
  private tipoCambioCLPtoUSD = 800; 

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private crudService: CrudfirebaseService,
    private alertController: AlertController,
    private auth: AngularFireAuth,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['viaje']) {
        const viaje = JSON.parse(params['viaje']);
        this.viajes = [viaje];
        this.dataService.setPrecio(viaje.precio);
        this.renderPayPalButton(viaje); 
      } else {
        this.cargarViajes();
      }
    });
  }

  cargarViajes() {}

  renderPayPalButton(viaje: Viaje) {
    const precioCLP = viaje.precio !== null ? viaje.precio : 0;
    const precioUSD = precioCLP / this.tipoCambioCLPtoUSD;

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            description: `Pago del viaje hacia ${viaje.destino}`,
            amount: {
              currency_code: 'USD',
              value: precioUSD.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          console.log('Transacción completada por ' + details.payer.name.given_name);
          this.pagarViaje(viaje);
        });
      },
      onError: err => {
        console.error('Error durante el proceso de pago de PayPal:', err);
      }
    }).render(this.paypalElement.nativeElement);
  }

  pagarViaje(viaje: Viaje) {
    console.log("Botón de pagar viaje presionado", viaje);
    if (viaje && viaje.id) {
      if (viaje.capacidad !== null && viaje.capacidad > 0) {
        const nuevaCapacidad = viaje.capacidad - 1;

        this.crudService.actualizarCapacidadViaje(viaje.id, nuevaCapacidad)
          .then(() => {
            console.log(`Capacidad actualizada a ${nuevaCapacidad} para el viaje ${viaje.id}`);

            this.auth.authState.pipe(take(1)).subscribe(user => {
              if (user) {
                const usuarioId = user.uid;
                if (viaje.id) {
                  this.crudService.agregarUsuarioPagante(viaje.id, usuarioId);
                } else {
                  console.error('ID de viaje es undefined');
                }
              } else {
                console.error('No hay usuario autenticado');
              }
            });

            this.mostrarAlerta('Pago realizado', 'El pago se ha realizado con éxito.');
            this.navCtrl.navigateRoot('/home2');
          })
          .catch((error: any) => {
            console.error('Error al actualizar la capacidad:', error);
          });
      } else {
        console.error("La capacidad es nula o no hay capacidad disponible.");
      }
    } else {
      console.error("El viaje no está definido o no tiene ID.");
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

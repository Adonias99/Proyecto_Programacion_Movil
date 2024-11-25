import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Viaje } from 'src/app/model/viajes'; // Asegúrate de usar 'Viaje'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-viaje',
  templateUrl: './lista-viaje.page.html',
  styleUrls: ['./lista-viaje.page.scss'],
})
export class ListaViajePage implements OnInit, OnDestroy {
  viajes: Viaje[] = []; 
  userId: string | null = null;
  private authSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
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

 
  verRuta(viaje: Viaje) {
    if (viaje.inicioLat && viaje.inicioLng && viaje.destinoLat && viaje.destinoLng) {
      this.navCtrl.navigateForward(['/iniciar-viaje', { 
        start: JSON.stringify({ lat: viaje.inicioLat, lng: viaje.inicioLng }), 
        end: JSON.stringify({ lat: viaje.destinoLat, lng: viaje.destinoLng }),
        destino: viaje.destino // Añadir el destino también
      }]);
    } else {
      console.error('Coordenadas inválidas:', viaje);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  irQR(viaje: Viaje) {
    // Primero obtenemos el nombre del usuario
    this.crudServ.obtenerUsuarioPorId(viaje.userId!).then(usuario => {
      if (usuario) {
        const codigoQR = {
          codigoViaje: viaje.id, // ID del viaje
          capacidad: viaje.capacidad, // Capacidad del viaje
          nombreUsuario: usuario.nombreUsuario // Nombre del usuario basado en su ID
        };
  
        // Navegar a la página QR pasando el objeto completo
        this.navCtrl.navigateForward(['/qr', { codigoQR: JSON.stringify(codigoQR) }]);
      } else {
        console.error('Usuario no encontrado');
      }
    }).catch(error => {
      console.error('Error al obtener el usuario:', error);
    });
  }
}

// misviajes.page.ts
import { Component, OnInit } from '@angular/core';
import { Viaje } from 'src/app/model/viajes';
import { NavController } from '@ionic/angular';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-misviajes',
  templateUrl: './misviajes.page.html',
  styleUrls: ['./misviajes.page.scss'],
})
export class MisviajesPage implements OnInit {
  viajes: Viaje[] = [];
  userId: string | null = null;

  constructor(private crudServ: CrudfirebaseService, private navCtrl: NavController, private auth: AngularFireAuth) {}

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

  home() {
    this.navCtrl.navigateForward(['/home']);
  }

  vermas(viaje: Viaje) {
    if (viaje.inicioLat && viaje.inicioLng && viaje.destinoLat && viaje.destinoLng) {
      this.navCtrl.navigateForward(['/mapa', { 
        start: JSON.stringify({ lat: viaje.inicioLat, lng: viaje.inicioLng }), 
        end: JSON.stringify({ lat: viaje.destinoLat, lng: viaje.destinoLng }),
        destino: viaje.destino, // Añadir el destino también
        id: viaje.id
      }]);
    } else {
      console.error('Coordenadas inválidas:', viaje);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Viaje } from 'src/app/model/viajes';
import { NavController } from '@ionic/angular';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service'; 

@Component({
  selector: 'app-buscarviaje',
  templateUrl: './buscarviaje.page.html',
  styleUrls: ['./buscarviaje.page.scss'],
})
export class BuscarviajePage implements OnInit {

  viajes: Viaje[] = [];
  filteredViajes: Viaje[] = [];
  searchTerm: string = '';

  constructor(private navCtrl: NavController, private crudService: CrudfirebaseService) { }

  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    // Obtener todos los viajes de Firebase
    this.crudService.obtenerTodosLosViajes().subscribe(viajes => {
      this.viajes = viajes;
      this.filteredViajes = viajes.filter(viaje => viaje.capacidad !== null && viaje.capacidad > 0); // Inicializar solo con viajes disponibles
      console.log("Viajes Cargados desde Firebase:", this.viajes);
    }, error => {
      console.error("Error al cargar los viajes de Firebase: ", error);
    });
  }

  filtrarViajes() {
    if (this.searchTerm) {
      this.filteredViajes = this.viajes.filter(viaje => 
        viaje.destino.toLowerCase().includes(this.searchTerm.toLowerCase()) && 
        viaje.capacidad !== null && viaje.capacidad > 0 // Verifica que capacidad no sea null
      );
    } else {
      this.filteredViajes = this.viajes.filter(viaje => 
        viaje.capacidad !== null && viaje.capacidad > 0 // Solo mostrar viajes con capacidad > 0
      );
    }
  }

  detalleviaje(viaje: Viaje) {
    this.navCtrl.navigateForward(['/detalleviaje', { viaje: JSON.stringify(viaje) }]);
  }
}

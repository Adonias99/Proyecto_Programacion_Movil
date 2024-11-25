import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapbox from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { Viaje } from 'src/app/model/viajes';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  
  map: mapbox.Map;
  nuevo_Viajes: Viaje = { destino: '', capacidad: null, precio: null, hora: '', encuentro: '' };
  arreglo_direcciones: Direcciones[] = [];
  ruta_mapa: string = '';

  constructor(private http: HttpClient, private CrudServ: CrudfirebaseService, private navCtrl: NavController) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    (mapbox as any).accessToken = environment.MAPBOX_ACCESS_TOKEN;
    this.map = new mapbox.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-70.57888363069907, -33.59809422319841],
      zoom: 16,
    });

    new mapbox.Marker({ color: 'red' })
      .setLngLat([-70.57888363069907, -33.59809422319841])
      .addTo(this.map);
  }

  buscarDireccion() {
    const texto = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.nuevo_Viajes.destino}.json?access_token=${environment.MAPBOX_ACCESS_TOKEN}`;
    this.http.get(texto).subscribe((data: any) => {
      this.arreglo_direcciones = data.features.map(element => ({
        place_name: element.place_name,
        lng: element.center[0],
        lat: element.center[1]
      }));

      // Si hay direcciones disponibles, selecciona la primera como predeterminada
      if (this.arreglo_direcciones.length > 0) {
        const primeraDireccion = this.arreglo_direcciones[0];
        this.nuevo_Viajes.destino = primeraDireccion.place_name;
        this.nuevo_Viajes.destinoLat = primeraDireccion.lat;
        this.nuevo_Viajes.destinoLng = primeraDireccion.lng;
        
        // También se puede añadir un marcador para la primera dirección en el mapa
        new mapbox.Marker({ color: 'blue' })
          .setLngLat([primeraDireccion.lng, primeraDireccion.lat])
          .addTo(this.map);

        // Crear la URL para la ruta usando la primera dirección
        this.ruta_mapa = `https://api.mapbox.com/directions/v5/mapbox/driving/${-70.57888363069907},${-33.59809422319841};${primeraDireccion.lng},${primeraDireccion.lat}?geometries=geojson&access_token=${environment.MAPBOX_ACCESS_TOKEN}`;
        this.ruta();
      }
    });
  }

  direccion_seleccionada(ev) {
    const seleccionada = ev.detail.value;

    if (seleccionada) {
      new mapbox.Marker({ color: 'blue' })
        .setLngLat([seleccionada.lng, seleccionada.lat])
        .addTo(this.map);

      this.nuevo_Viajes.destinoLat = seleccionada.lat;
      this.nuevo_Viajes.destinoLng = seleccionada.lng;
      this.nuevo_Viajes.inicioLat = -33.59809422319841;
      this.nuevo_Viajes.inicioLng = -70.57888363069907;

      this.ruta_mapa = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.nuevo_Viajes.inicioLng},${this.nuevo_Viajes.inicioLat};${seleccionada.lng},${seleccionada.lat}?geometries=geojson&access_token=${environment.MAPBOX_ACCESS_TOKEN}`;
      this.ruta();
    } else {
      console.error('Selección no válida:', seleccionada);
    }
  }

  ruta() {
    this.http.get(this.ruta_mapa).subscribe((data: any) => {
      if (data.routes && data.routes.length > 0) {
        const rutaGeoJson = data.routes[0].geometry;

        if (this.map.getSource('route')) {
          this.map.removeLayer('route');
          this.map.removeSource('route');
        }

        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: rutaGeoJson,
            properties: {}
          }
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': 'green',
            'line-width': 4
          }
        });
      } else {
        console.error('No se encontraron rutas.');
      }
    }, (error) => {
      console.error('Error al obtener la ruta:', error);
    });
  }

  grabar() {
    if (!this.nuevo_Viajes.destino || 
        !this.nuevo_Viajes.capacidad || 
        !this.nuevo_Viajes.precio || 
        !this.nuevo_Viajes.hora || 
        !this.nuevo_Viajes.encuentro ||
        !this.nuevo_Viajes.inicioLat || 
        !this.nuevo_Viajes.inicioLng || 
        !this.nuevo_Viajes.destinoLat || 
        !this.nuevo_Viajes.destinoLng) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    this.CrudServ.crearViajes(this.nuevo_Viajes).then(() => {
      setTimeout(() => {
      }, 1000), this.navCtrl.navigateForward(['/home']);
    }).catch(err => {
      console.log("Error", err);
    });
  }
}

export interface Direcciones {
  place_name: string;
  lat: number;
  lng: number;
}

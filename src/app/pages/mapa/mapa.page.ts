import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapbox from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map: mapbox.Map;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  destino: string;
  viajeIniciado: boolean = false; // Estado del viaje
  idViaje: any;
  
  // Variables para almacenar distancia y duración
  distancia: string;
  duracion: string;
  error: boolean = false;  // Estado para manejar errores

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private crudServ: CrudfirebaseService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const start = JSON.parse(params.get('start') || '{}');
      const end = JSON.parse(params.get('end') || '{}');
      this.destino = params.get('destino') || '';
      this.start = start;
      this.end = end;
      this.idViaje = params.get('id');

      // Iniciar el mapa
      this.initMap();
    });
  }

  initMap() {
    (mapbox as any).accessToken = environment.MAPBOX_ACCESS_TOKEN;
    this.map = new mapbox.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.start.lng, this.start.lat],
      zoom: 12,
    });

    // Crear marcador para el punto de inicio
    new mapbox.Marker({ color: 'red' })
      .setLngLat([this.start.lng, this.start.lat])
      .addTo(this.map);

    // Crear marcador para el punto de destino
    new mapbox.Marker({ color: 'blue' })
      .setLngLat([this.end.lng, this.end.lat])
      .addTo(this.map);
  }

  obtenerRuta() {
    const rutaUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.start.lng},${this.start.lat};${this.end.lng},${this.end.lat}?geometries=geojson&access_token=${environment.MAPBOX_ACCESS_TOKEN}`;
    fetch(rutaUrl)
      .then(response => response.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const rutaGeoJson = data.routes[0].geometry;
          this.distancia = (data.routes[0].distance / 1000).toFixed(2); // Distancia en km
          this.duracion = (data.routes[0].duration / 60).toFixed(2); // Duración en minutos
          this.error = false;  // Resetear el error si la llamada es exitosa

          // Agregar la ruta al mapa
          this.map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: rutaGeoJson,
              properties: {},
            },
          });

          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': 'green',
              'line-width': 4,
            },
          });
        } else {
          console.error('No se encontró la ruta');
          this.error = true;  // Establecer error si no hay rutas
        }
      })
      .catch(error => {
        console.error('Error al obtener la ruta:', error);
        this.error = true;  // Establecer error si ocurre algún problema con la API
      });
  }

  async toggleViaje() {
    if (!this.viajeIniciado) {
      // Iniciar viaje
      this.viajeIniciado = true;
      console.log("Viaje iniciado");
      this.obtenerRuta(); // Llamar para obtener la distancia y duración al iniciar el viaje
    } else {
      // Finalizar viaje
      const alert = await this.alertCtrl.create({
        header: 'Confirmar',
        message: '¿Estás seguro de que quieres finalizar el viaje?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Finalización de viaje cancelada');
            }
          },
          {
            text: 'Finalizar',
            handler: () => {
              this.viajeIniciado = false;
              console.log("Viaje finalizado");
              this.navCtrl.navigateRoot('/home');
            }
          }
        ]
      });
      await alert.present();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapbox from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CrudfirebaseService } from 'src/app/servicio/crudfirebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Viaje } from 'src/app/model/viajes';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-iniciar-viaje',
  templateUrl: './iniciar-viaje.page.html',
  styleUrls: ['./iniciar-viaje.page.scss'],
})
export class IniciarViajePage implements OnInit {
  map: mapbox.Map;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  destino: string;
  idViaje: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private crudServ: CrudfirebaseService,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
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

    // Obtener la ruta entre el inicio y el destino
    this.obtenerRuta();
  }

  obtenerRuta() {
    const rutaUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.start.lng},${this.start.lat};${this.end.lng},${this.end.lat}?geometries=geojson&access_token=${environment.MAPBOX_ACCESS_TOKEN}`;
    fetch(rutaUrl)
      .then(response => response.json())
      .then(data => {
        if (data.routes && data.routes.length > 0) {
          const rutaGeoJson = data.routes[0].geometry;
          const distancia = data.routes[0].distance / 1000; // Convertir metros a kilómetros
        const duracion = data.routes[0].duration / 60;

        console.log(`Distancia: ${distancia.toFixed(2)} km`);
        console.log(`Duración: ${duracion.toFixed(2)} minutos`);

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
        }
      })
      .catch(error => {
        console.error('Error al obtener la ruta:', error);
      });
  }


  




}

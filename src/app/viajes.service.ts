import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  private viajes: Array<any> = [];

  constructor() { }

  agregarViaje(viaje: any) {
    this.viajes.push(viaje);
  }

  obtenerViajes() {
    return this.viajes;
  }
}

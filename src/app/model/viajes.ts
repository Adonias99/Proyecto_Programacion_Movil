// src/app/model/viajes.ts
export class Viaje {
  id?: string;
  destino: string;
  capacidad: number | null;
  precio: number | null;
  hora: string;
  encuentro: string;
  userId?: string;
  usuariosPagantes?: string[];
  inicioLat?: number; // Latitud de inicio
  inicioLng?: number; // Longitud de inicio
  destinoLat?: number; // Latitud de destino
  destinoLng?: number; // Longitud de destino

  constructor(
    destino: string,
    capacidad: number | null,
    precio: number,
    hora: string,
    encuentro: string,
    userId?: string,
    usuariosPagantes?: string[],
    inicioLat?: number,
    inicioLng?: number,
    destinoLat?: number,
    destinoLng?: number
  ) {
    this.destino = destino;
    this.capacidad = capacidad;
    this.precio = precio;
    this.hora = hora;
    this.encuentro = encuentro;
    this.userId = userId;
    this.usuariosPagantes = usuariosPagantes || [];
    this.inicioLat = inicioLat;
    this.inicioLng = inicioLng;
    this.destinoLat = destinoLat;
    this.destinoLng = destinoLng;
  }
}

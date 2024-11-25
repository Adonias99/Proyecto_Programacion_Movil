import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private viajePrecioSource = new BehaviorSubject<number>(0);
  currentPrecio = this.viajePrecioSource.asObservable();

  setPrecio(precio: number) {
    this.viajePrecioSource.next(precio);
  }
}

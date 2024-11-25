import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { FieldValue } from 'firebase/firestore'; 
import firebase from 'firebase/compat/app';
import { Viaje } from '../model/viajes';

export interface Usuario {
  id?: string;
  correo: string;
  nombreUsuario: string;
  contrasenna: string;
  nombreApellido: string;
}

export interface Viajes {
  id?: string;
  destino: string;
  capacidad: number | null;
  precio: number | null;
  hora: string;
  encuentro: string;
  userId?: string; 
  usuariosPagantes?: string[]; 
  destinoLat?: number; 
  destinoLng?: number;
  inicioLat?: number;
  inicioLng?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CrudfirebaseService {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  agregarUsuarioPagante(viajeId: string, usuarioId: string) {
    return this.firestore.collection('Viajes').doc(viajeId).update({
        usuariosPagantes: firebase.firestore.FieldValue.arrayUnion(usuarioId)
    });
  }

  obtenerUsuarioPorId(usuarioId: string): Promise<Usuario | null> {
    return this.firestore.collection('Usuario').doc(usuarioId).get().toPromise()
      .then(docSnapshot => {
        if (docSnapshot?.exists) {
          return docSnapshot.data() as Usuario;
        } else {
          return null;
        }
      });
  }

  crearUsuario(usuario: Usuario) {
    return this.auth.createUserWithEmailAndPassword(usuario.correo, usuario.contrasenna)
      .then(userCredential => {
        const uid = userCredential.user?.uid;
        return this.firestore.collection('Usuario').doc(uid).set({
          correo: usuario.correo,
          nombreUsuario: usuario.nombreUsuario,
          nombreApellido: usuario.nombreApellido
        });
      });
  }

  iniciarSesion(correo: string, contrasena: string): Promise<Usuario | null> {
    return this.auth.signInWithEmailAndPassword(correo, contrasena)
      .then(userCredential => {
        const uid = userCredential.user?.uid;
        return this.firestore.collection('Usuario').doc(uid).get().toPromise()
          .then(docSnapshot => {
            if (docSnapshot?.exists) {
              return docSnapshot.data() as Usuario;
            } else {
              throw new Error('Usuario no encontrado en Firestore');
            }
          });
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }

  async crearViajes(viaje: Viajes) {
    const userCredential = await this.auth.currentUser;
    if (userCredential) {
      viaje.userId = userCredential.uid;
    }
    return this.firestore.collection('Viajes').add(viaje);
  }

  obtenerViajes(): Observable<Viajes[]> {
    return new Observable((observer) => {
      this.auth.authState.subscribe((user) => {
        if (user) {
          this.firestore
            .collection<Viajes>('Viajes', (ref) => ref.where('userId', '==', user.uid)) 
            .valueChanges({ idField: 'id' })
            .subscribe((viajes) => {
              observer.next(viajes);
              observer.complete();
            });
        } else {
          observer.next([]); 
          observer.complete();
        }
      });
    });
  }

  obtenerTodosLosViajes(): Observable<Viajes[]> {
    return this.firestore.collection<Viajes>('Viajes').valueChanges({ idField: 'id' });
  }

  eliminarViajes(id: string) {
    return this.firestore.collection('Viajes').doc(id).delete();
  }

  actualizarCapacidadViaje(viajeId: string, nuevaCapacidad: number) {
    return this.firestore.collection('Viajes').doc(viajeId).update({
      capacidad: nuevaCapacidad
    });
  }

  actualizarViaje(viajeId: string, data: Partial<Viajes>): Promise<void> {
    return this.firestore.collection('Viajes').doc(viajeId).update(data);
  }
}

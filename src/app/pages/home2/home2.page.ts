import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';  
import { AngularFirestore } from '@angular/fire/compat/firestore';  
import { CrudfirebaseService, Usuario } from 'src/app/servicio/crudfirebase.service';  

@Component({
  selector: 'app-home2',
  templateUrl: 'home2.page.html',
  styleUrls: ['home2.page.scss'],
})
export class Home2Page {
usuario:string=''
constructor(
  private navCtrl: NavController,
  private afAuth: AngularFireAuth,  // Autenticación de Firebase
  private firestore: AngularFirestore,
  private CrudServ: CrudfirebaseService // Firestore para obtener el perfil del usuario
) { }

ngOnInit(): void {
  // Suscribirse al estado de autenticación de Firebase
  this.afAuth.authState.subscribe(user => {
    if (!user) {
      // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
      this.navCtrl.navigateForward(['/login']);
    } else {
      // Si el usuario está autenticado, buscar en Firestore su información
      this.firestore.collection('Usuario').doc(user.uid).get().subscribe(docSnapshot => {
        if (docSnapshot.exists) {
          const userData = docSnapshot.data() as Usuario;  // Asegurarse de que los datos son del tipo Usuario
          this.usuario = userData?.nombreUsuario || '';  // Asignar el nombre de usuario
        } else {
          this.usuario = 'Usuario no encontrado';  // Si no se encuentra el documento
        }
      }, error => {
        console.error("Error al obtener los datos del usuario: ", error);
        this.usuario = 'Error al obtener usuario';
      });
    }
  });
}

listaviaje(){
    this.navCtrl.navigateForward(['/lista-viaje']);
  }

  cancelarviaje(){
    this.navCtrl.navigateForward(['/cancelarviaje2']);
  }
buscar() {
    this.navCtrl.navigateForward(['/buscarviaje']);
  }

// Método de cierre de sesión utilizando Firebase Authentication
cerrar_sesion() {
  this.afAuth.signOut().then(() => {
    this.navCtrl.navigateForward(['/elegir']);  // Redirigir al usuario
  }).catch(error => {
    console.error('Error al cerrar sesión:', error);  // Capturar cualquier error
  });
}

iniciar_viaje() {
  this.navCtrl.navigateForward(['/iniciar-viaje']);
}
}

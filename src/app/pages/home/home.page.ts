import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';  
import { AngularFirestore } from '@angular/fire/compat/firestore';  
import { CrudfirebaseService, Usuario } from 'src/app/servicio/crudfirebase.service';  

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuario: string = '';  

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,  
    private firestore: AngularFirestore,
    private CrudServ: CrudfirebaseService 
  ) { }

  ngOnInit(): void {
   
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        
        this.navCtrl.navigateForward(['/login']);
      } else {
        
        this.firestore.collection('Usuario').doc(user.uid).get().subscribe(docSnapshot => {
          if (docSnapshot.exists) {
            const userData = docSnapshot.data() as Usuario;  
            this.usuario = userData?.nombreUsuario || '';  
          } else {
            this.usuario = 'Usuario no encontrado';  
          }
        }, error => {
          console.error("Error al obtener los datos del usuario: ", error);
          this.usuario = 'Error al obtener usuario';
        });
      }
    });
  }

  programar() {
    this.navCtrl.navigateForward(['/programar-viaje']);
  }

  misviajes() {
    this.navCtrl.navigateForward(['/misviajes']);
  }

  cancelarviaje() {
    this.navCtrl.navigateForward(['/cancelarviaje']);
  }

  
  cerrar_sesion() {
    this.afAuth.signOut().then(() => {
      this.navCtrl.navigateForward(['/elegir']);  
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);  
    });
  }

  iniciar_viaje() {
    this.navCtrl.navigateForward(['/iniciar-viaje']);
  }
  leer_qr(){
    this.navCtrl.navigateForward(['/leer-qr']);
  }
  scanner_qr(){
    this.navCtrl.navigateForward(['qr-scanner']);
  }
}

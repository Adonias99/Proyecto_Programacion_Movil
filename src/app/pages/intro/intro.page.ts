import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements AfterViewInit {
  @ViewChild('card', { static: false }) card!: ElementRef;

  private animation?: Animation;

  constructor(
    private navCtrl: NavController,
    private animationCtrl: AnimationController
  ) {}

  ngAfterViewInit() {
    console.log('View has been initialized');
    this.play(); // Llamar al método play directamente después de la inicialización
  }

  play() {
    const imgElement = this.card.nativeElement.querySelector('img');
    if (imgElement) {
      console.log('Image element found:', imgElement);
  
      this.animation = this.animationCtrl
        .create()
        .addElement(imgElement)
        .duration(1000) // Aumenta la duración a 3 segundos
        .delay(2000) // Mantiene el retraso de 2 segundos
        .iterations(1)
        .easing('ease-in-out') // Curva de aceleración para suavizar la animación
        .fromTo('transform', 'translateX(0)', 'translateX(100%)') // Mueve la imagen a la derecha
        .fromTo('opacity', '1', '0') // Desvanece la imagen
        .onFinish(() => {
          console.log('Animation finished, navigating to elegir');
          this.navCtrl.navigateForward('/elegir');
        });
  
      this.animation.play();
  
      console.log('Animation is playing');
    } else {
      console.error('Image element not found.');
    }
  }
}
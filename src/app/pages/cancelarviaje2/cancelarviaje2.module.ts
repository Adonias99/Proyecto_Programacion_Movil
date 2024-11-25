import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Cancelarviaje2PageRoutingModule } from './cancelarviaje2-routing.module';

import { Cancelarviaje2Page } from './cancelarviaje2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cancelarviaje2PageRoutingModule
  ],
  declarations: [Cancelarviaje2Page]
})
export class Cancelarviaje2PageModule {}

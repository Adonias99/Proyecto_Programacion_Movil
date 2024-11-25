import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaViajePageRoutingModule } from './lista-viaje-routing.module';

import { ListaViajePage } from './lista-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaViajePageRoutingModule
  ],
  declarations: [ListaViajePage]
})
export class ListaViajePageModule {}

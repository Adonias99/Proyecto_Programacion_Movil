import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IniciarViajePageRoutingModule } from './iniciar-viaje-routing.module';

import { IniciarViajePage } from './iniciar-viaje.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IniciarViajePageRoutingModule,
    HttpClientModule
  ],
  declarations: [IniciarViajePage]
})
export class IniciarViajePageModule {}

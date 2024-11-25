import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgramarViajePageRoutingModule } from './programar-viaje-routing.module';

import { ProgramarViajePage } from './programar-viaje.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramarViajePageRoutingModule,
    HttpClientModule
  ],
  declarations: [ProgramarViajePage]
})
export class ProgramarViajePageModule {}

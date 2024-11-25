import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelarviajePageRoutingModule } from './cancelarviaje-routing.module';

import { CancelarviajePage } from './cancelarviaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelarviajePageRoutingModule
  ],
  declarations: [CancelarviajePage]
})
export class CancelarviajePageModule {}

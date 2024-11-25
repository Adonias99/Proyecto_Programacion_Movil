import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPageRoutingModule } from './mapa-routing.module';

import { MapaPage } from './mapa.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,HttpClientModule,
    MapaPageRoutingModule,
    
  ],
  providers: [ MapaPage],
  bootstrap: [ MapaPage],
  declarations: [MapaPage]
  
})
export class MapaPageModule {}

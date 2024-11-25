import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { ComponentComponent } from 'src/app/component/component.component'; // Importa el componente standalone

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentComponent // Agrega el componente aquí
  ],
  declarations: [HomePage],
})
export class HomePageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaViajePage } from './lista-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: ListaViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaViajePageRoutingModule {}

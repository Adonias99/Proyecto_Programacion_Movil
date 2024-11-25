import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Cancelarviaje2Page } from './cancelarviaje2.page';

const routes: Routes = [
  {
    path: '',
    component: Cancelarviaje2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Cancelarviaje2PageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelarviajePage } from './cancelarviaje.page';

const routes: Routes = [
  {
    path: '',
    component: CancelarviajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelarviajePageRoutingModule {}

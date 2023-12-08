import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuPasswordPage } from './recu-password.page';

const routes: Routes = [
  {
    path: '',
    component: RecuPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuPasswordPageRoutingModule {}

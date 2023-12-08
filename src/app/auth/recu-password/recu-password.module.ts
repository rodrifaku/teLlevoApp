import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuPasswordPageRoutingModule } from './recu-password-routing.module';

import { RecuPasswordPage } from './recu-password.page';
import { CompartidoModule } from 'src/app/compartido/compartido.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuPasswordPageRoutingModule,
    CompartidoModule
  ],
  declarations: [RecuPasswordPage]
})
export class RecuPasswordPageModule {}

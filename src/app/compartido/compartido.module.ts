import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componentes/header/header.component';
import { EntradaComponent } from './componentes/entrada/entrada.component';
import { LogoComponent } from './componentes/logo/logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddUpdateViajeComponent } from './componentes/add-update-viaje/add-update-viaje.component';
import { AddCarComponent } from './componentes/add-car/add-car.component';


@NgModule({
  declarations: [
    HeaderComponent,
    EntradaComponent,
    LogoComponent,
    AddUpdateViajeComponent,
    AddCarComponent
  ],
  exports: [
    HeaderComponent,
    EntradaComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateViajeComponent,
    AddCarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CompartidoModule { }

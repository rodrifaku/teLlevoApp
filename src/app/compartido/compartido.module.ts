import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componentes/header/header.component';
import { EntradaComponent } from './componentes/entrada/entrada.component';
import { LogoComponent } from './componentes/logo/logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddUpdateViajeComponent } from './componentes/add-update-viaje/add-update-viaje.component';
import { AddCarComponent } from './componentes/add-car/add-car.component';
import { ManageTripsComponent } from './componentes/manage-trips/manage-trips.component';
import { ManageReservationsComponent } from './componentes/manage-reservations/manage-reservations.component';


@NgModule({
  declarations: [
    HeaderComponent,
    EntradaComponent,
    LogoComponent,
    AddUpdateViajeComponent,
    AddCarComponent,
    ManageTripsComponent,
    ManageReservationsComponent
  ],
  exports: [
    HeaderComponent,
    EntradaComponent,
    LogoComponent,
    ReactiveFormsModule,
    AddUpdateViajeComponent,
    AddCarComponent,
    ManageTripsComponent,
    ManageReservationsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CompartidoModule { }

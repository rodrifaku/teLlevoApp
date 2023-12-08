import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './componentes/header/header.component';
import { EntradaComponent } from './componentes/entrada/entrada.component';
import { LogoComponent } from './componentes/logo/logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    HeaderComponent,
    EntradaComponent,
    LogoComponent
  ],
  exports: [
    HeaderComponent,
    EntradaComponent,
    LogoComponent,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CompartidoModule { }

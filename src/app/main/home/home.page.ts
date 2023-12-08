import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { AddUpdateViajeComponent } from 'src/app/compartido/componentes/add-update-viaje/add-update-viaje.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }


  signOut(){
    this.firebaseSvc.signOut();
  }


  addUpdateViaje(){
    this.utilsSvc.presentModal({
      component: AddUpdateViajeComponent
    })
  }
}

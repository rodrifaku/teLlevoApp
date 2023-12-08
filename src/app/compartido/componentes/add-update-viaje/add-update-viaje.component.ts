import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-add-update-viaje',
  templateUrl: './add-update-viaje.component.html',
  styleUrls: ['./add-update-viaje.component.scss'],
})
export class AddUpdateViajeComponent  implements OnInit {

  form = new FormGroup({

    uid: new FormControl(''),
    id: new FormControl(''),
    marca: new FormControl('',[Validators.required, Validators.minLength(3)]),
    modelo: new FormControl('',[Validators.required, Validators.minLength(3)]),
    patente: new FormControl('',[Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    precio: new FormControl('',[Validators.required,Validators.min(0)]),
    image: new FormControl('',[Validators.required]),
    disponible: new FormControl('',[Validators.required,Validators.min(0)]),

  })

  firebaseSvc= inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  // Cargando......




}

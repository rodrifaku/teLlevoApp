import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from './../../servicios/utils.service';

@Component({
  selector: 'app-recu-password',
  templateUrl: './recu-password.page.html',
  styleUrls: ['./recu-password.page.scss'],
})
export class RecuPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
  })

  firebaseSvc= inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }


//Cargando......
  async submit(){
    if(this.form.valid){

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {

        this.utilsSvc.presentToast({
          message: '¡Correo enviado con éxito!',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        })

        this.utilsSvc.routerLink('/auth');
        this.form.reset();


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: '¡Error, debe ingresa los datos correctos!',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();

      })

    }

  }

  

}

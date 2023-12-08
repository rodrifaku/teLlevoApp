import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(3),Validators.maxLength(10)]),
    name: new FormControl('',[Validators.required, Validators.minLength(4)]),
    tipo: new FormControl('',[Validators.required]),
    telefono: new FormControl('',[Validators.required, Validators.min(7)]),
    carrera: new FormControl('',[Validators.required, Validators.minLength(4)]),
    direccion: new FormControl('',[Validators.required, Validators.minLength(4)]),

  })

  firebaseSvc= inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  // Cargando......
async submit() {
  if (this.form.valid) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    const userName = this.form.value.name as string | undefined;

    if (userName !== undefined) {
      this.firebaseSvc.signUp(this.form.value as User)
        .then(async res => {
          await this.firebaseSvc.updateUser(userName);

          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);

          this.setUserInfo(uid);
          this.utilsSvc.routerLink('auth');

        })
        .catch(error => {
          console.error(error);

          this.utilsSvc.presentToast({
            message: '¡Error, debe ingresar los datos correctos!',
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    } else {
      console.error('El nombre es undefined');
      loading.dismiss(); 
    }
  }
}


async setUserInfo(uid: string) {
  if (this.form.valid) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let path = `users/${uid}`;
    delete this.form.value.password;

    
      this.firebaseSvc.setDocument(path,this.form.value )
        .then(async res => {

          this.utilsSvc.saveInStorage('user', this.form.value);
          this.utilsSvc.routerLink('home');
          this.form.reset();

        })
        .catch(error => {
          console.error(error);

          this.utilsSvc.presentToast({
            message: '¡Error, debe ingresar los datos correctos!',
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    
  }
}
}

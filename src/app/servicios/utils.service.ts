import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions, ModalController, ModalOptions, AlertController, AlertOptions } from '@ionic/angular';
import {Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  loadingCtrl = inject (LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);

//alert..........
async presentAlert(opts?: AlertOptions){
  const alert = await this.alertCtrl.create(opts);

  await alert.present();
}


//loading..........
  loading(){
    return this.loadingCtrl.create({spinner: 'crescent'})
  }

//toast..........
async presentToast(opts?: ToastOptions) {
  const toast = await this.toastCtrl.create(opts);
  toast.present();
}

//Enruta a cualquier página disponible..........
routerLink(url: string){
  return this.router.navigateByUrl(url);
}

//Guarda un elemento en el localstorage..........
saveInStorage(key: string, value: any){
  return localStorage.setItem(key, JSON.stringify(value))
}

// Obtener un elemento en el localStorage..........
getFromStorage(key: string) {
  const storedValue = localStorage.getItem(key);

  if (storedValue !== null) {
    return JSON.parse(storedValue);
  }

  return null;
}

// Modal..........
async presentModal(opts: ModalOptions){
  const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) return data;
}
dismissModal(data?: any){
  return this.modalCtrl.dismiss(data);
}

// TOMAR FOTO..........
async takePicture(promptLabelHeader: string){
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Selecciona una imagen',
    promptLabelPicture: 'Toma una foto'
  });
}
}
import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss'],
})
export class AddCarComponent {
  carForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
    private utilsSvc:UtilsService
  ) {
    this.carForm = this.formBuilder.group({
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      patente: ['', [Validators.required]],
      color: ['', [Validators.required]],
      asientosDisponibles: [0, [Validators.required, Validators.min(0)]],
      sectorMovilizacion: ['', [Validators.required]],
      valor: [0, [Validators.required, Validators.min(0)]],
      horaSalida:['', (Validators.required)],
      image:  ['', [Validators.required]],
    });
  }
  

  async takeImage(){

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Vehículo')).dataUrl
    this.carForm.controls['image'].setValue(dataUrl);
  }
  onSubmit() {
    if (this.carForm.valid) {
      // Retrieve the current user's UID
      const currentUserUID = this.firebaseSvc.getCurrentUserUID();
  
      if (currentUserUID) {
        // Prepare the car data, including the userId
        const carData = {
          ...this.carForm.value,
          userId: currentUserUID
        };
  
        // Add the car with the userId
        this.firebaseSvc.addCar(carData).then(() => {
          // Handle successful addition of the car
          this.carForm.reset();
          this.closeModal();
        }).catch(error => {
          // Handle any errors that occur during the addition
          console.error('Error adding car:', error);
        });
      } else {
        // Handle the case where no user is logged in
        console.error('No user logged in');
      }
    } else {
      // Handle the case where the form is invalid
      console.error('Form is invalid');
    }
  }

  closeModal() {
    this.modalController.dismiss(); // Close the modal
  }
}

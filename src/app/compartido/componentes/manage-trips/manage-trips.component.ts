import { Car } from 'src/app/models/car.model';
import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Trip } from 'src/app/models/trip.model';
import { formatDate } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-manage-trips',
  templateUrl: './manage-trips.component.html',
  styleUrls: ['./manage-trips.component.scss'],
})
export class ManageTripsComponent implements OnInit {
  @Input() selectedCar: Car;
  tripForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
    private firestore: AngularFirestore
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    if (this.selectedCar) {
      this.initializeFormWithCarData();
    }
  }
  
  ngOnChanges() {
    if (this.selectedCar) {
      this.initializeFormWithCarData();
    }
  }

  initializeFormWithCarData() {
    const today = new Date();
    const formattedToday = formatDate(today, 'yyyy-MM-dd', 'en');
    this.tripForm = this.formBuilder.group({
      seats: [this.selectedCar.asientosDisponibles, [Validators.required, Validators.min(1), Validators.max(this.selectedCar.asientosDisponibles)]],
      fecha: [formattedToday, Validators.required]
    });
  }

  initializeForm() {
    const today = new Date();
    const formattedToday = formatDate(today, 'yyyy-MM-dd', 'en');

    this.tripForm = this.formBuilder.group({
      seats: ['', [Validators.required, Validators.min(1), Validators.max(this.selectedCar?.asientosDisponibles || 0)]],
      fecha: [formattedToday, Validators.required]
    });
  }

  submitTrip() {
    if (this.tripForm.valid && this.selectedCar) {
      const tripData: Trip = {
        carId: this.selectedCar.id,
        userId: this.firebaseSvc.getCurrentUserUID(),
        seats: this.tripForm.value.seats,
        fecha: this.tripForm.value.fecha,
        reservedSeats: 0
      };
  
      // Generar un nuevo ID para el viaje
      const newTripId = this.firestore.createId();
  
      // Asignar el nuevo ID al objeto Trip
      tripData.id = newTripId;
  
      // Crear el viaje en Firebase
      this.firebaseSvc.createTrip(tripData).then(() => {
        console.log('Viaje creado exitosamente');
        this.closeModal();
      }).catch(error => {
        console.error('Error al crear el viaje:', error);
      });
    } else {
      console.error('Formulario no es válido');
    }
  }  

  closeModal() {
    this.modalController.dismiss();
  }
}

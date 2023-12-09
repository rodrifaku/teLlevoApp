import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Trip } from 'src/app/models/trip.model';
import { Reservation } from 'src/app/models/reservation.model';

@Component({
  selector: 'app-manage-reservations',
  templateUrl: './manage-reservations.component.html',
  styleUrls: ['./manage-reservations.component.scss'],
})
export class ManageReservationsComponent implements OnInit {
  @Input() selectedTrip: Trip;
  reservationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
    ) {
      this.initializeForm();
    }

    ngOnInit() {
      console.log(this.selectedTrip);
      if (this.selectedTrip) {
        this.initializeFormWithCarData();
      }
    }
    
    initializeFormWithCarData() {
      this.reservationForm = this.formBuilder.group({
        seats: [1, [Validators.required, Validators.min(1), Validators.max(this.selectedTrip.seats - this.selectedTrip.reservedSeats)]],
      });
    }

  private loadSelectedTrip() {
    if (this.selectedTrip) {
      // Realiza una consulta a Firebase para obtener los detalles del viaje
      this.firebaseSvc.getTripById(this.selectedTrip.id).subscribe((trip: Trip) => {
        if (trip) {
          this.selectedTrip = trip;
          this.updateFormWithTripData();
        } else {
          console.error('No se encontró el viaje seleccionado.');
        }
      });
    } else {
      console.error('Viaje no definido.');
    }
  }

  ngOnChanges() {
    if (this.selectedTrip) {
      this.initializeFormWithCarData();
    }
  }

  private initializeForm() {
    this.reservationForm = this.formBuilder.group({
      seats: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private updateFormWithTripData() {
    if (this.selectedTrip) {
      const maxSeats = this.selectedTrip.seats - this.selectedTrip.reservedSeats;
      this.reservationForm.get('seats').setValidators([Validators.required, Validators.min(1), Validators.max(maxSeats)]);
      this.reservationForm.get('seats').updateValueAndValidity();
    }
  }

  submitReservation() {
    if (!this.reservationForm.valid) {
      console.error('Formulario no es válido.');
      return;
    }

    if (!this.selectedTrip || !this.selectedTrip['id']) {
      console.error('No se ha seleccionado un viaje o el ID del viaje no está definido.');
      return;
    }

    const userId = this.firebaseSvc.getCurrentUserUID();
    const reservationData: Reservation = {
      userId: userId,
      seats: this.reservationForm.value.seats,
      reservationDate: new Date(), // Fecha y hora actuales
      tripId: this.selectedTrip.id,
    };
    console.log('Datos de reserva:', reservationData);
    this.firebaseSvc.createReservation(reservationData)
      .then(() => {
        console.log('Reserva creada exitosamente');
        this.closeModal();
      })
      .catch(error => {
        console.error('Error al crear la reserva:', error);
      });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}

import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Trip } from 'src/app/models/trip.model';

@Component({
  selector: 'app-manage-reservations',
  templateUrl: './manage-reservations.component.html',
  styleUrls: ['./manage-reservations.component.scss'],
})
export class ManageReservationsComponent implements OnInit, OnChanges {
  @Input() selectedTrip: Trip;
  reservationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    console.log('selectedTrip al inicializar:', this.selectedTrip);
    this.initializeForm();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log('selectedTrip ha cambiado:', this.selectedTrip);
    if (changes['selectedTrip']) {
      this.updateFormWithTripData();
    }
  }
  
  private initializeForm() {
    this.reservationForm = this.formBuilder.group({
      seats: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private updateFormWithTripData() {
    // Aquí podrías actualizar tu formulario en base a los datos de `selectedTrip` si es necesario.
  }

  submitReservation() {
    console.log('Intentando enviar reserva...', this.selectedTrip, this.reservationForm.value);
  
    if (!this.reservationForm.valid) {
      console.error('Formulario no es válido.');
      return;
    }
  
    if (!this.selectedTrip) {
      console.error('No se ha seleccionado un viaje.');
      return;
    }
  
    const userId = this.firebaseSvc.getCurrentUserUID();
    const reservationData = this.reservationForm.value;
  
    console.log('Creando reserva con:', {
      tripId: this.selectedTrip?.id,
      userId: userId,
      seats: reservationData.seats
    });
  
    this.firebaseSvc.createReservation(
      this.selectedTrip.id,
      userId,
      reservationData.seats
    ).then(() => {
      console.log('Reserva creada exitosamente');
      this.closeModal();
    }).catch(error => {
      console.error('Error al crear la reserva:', error);
    });
  }
  

  closeModal() {
    this.modalController.dismiss();
  }
}

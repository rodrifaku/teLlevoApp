import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { AddUpdateViajeComponent } from 'src/app/compartido/componentes/add-update-viaje/add-update-viaje.component';
import { AddCarComponent } from 'src/app/compartido/componentes/add-car/add-car.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  viajes = [];
  usuario: any;
  cars = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.firebaseSvc.getUserProfile().subscribe((userProfile: User) => {
      if (userProfile && userProfile.uid) {
        console.log('User profile:', userProfile);
        this.usuario = userProfile;
        this.loadUserCars();
      } else {
        console.error('No user profile or UID found');
      }
    });
  }
  
  loadUserCars() {
    if (this.usuario && this.usuario.uid) {
      console.log('Loading cars for user ID:', this.usuario.uid);
      this.firebaseSvc.getCarsByUserId(this.usuario.uid).subscribe(cars => {
        console.log('Cars:', cars);
        this.cars = cars;
      }, error => {
        console.error('Error fetching cars:', error);
      });
    } else {
      console.error('No user ID available for loading cars');
    }
  }  

  signOut() {
    this.firebaseSvc.signOut();
  }

  addAuto() {
    // Verificar que el usuario sea un conductor y mostrar el componente para gestionar autos
    if (this.usuario && this.usuario.tipo === 'Conductor') {
      this.utilsSvc.presentModal({
        component: AddCarComponent,
      });
    } else {
      console.log('No tienes permisos para agregar un auto.');
    }
  }

  addUpdateViaje() {
    // Verificar que el usuario sea un pasajero y mostrar el componente para agregar viaje
    if (this.usuario && this.usuario.tipo === 'Pasajero') {
      this.utilsSvc.presentModal({
        component: AddUpdateViajeComponent,
      });
    } else {
      console.log('No tienes permisos para agregar un viaje.');
    }
  }

  deleteCar(carId: string) {
    this.firebaseSvc.deleteCar(carId).then(() => {
      // Optionally, refresh the list of cars after deletion
      this.loadUserCars();
    }).catch(error => {
      console.error('Error deleting car:', error);
    });
  }
}

import { AddCarComponent } from 'src/app/compartido/componentes/add-car/add-car.component';
import { AddUpdateViajeComponent } from 'src/app/compartido/componentes/add-update-viaje/add-update-viaje.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Car } from 'src/app/models/car.model';
import { Trip } from 'src/app/models/trip.model';
import { Component, OnInit } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/compat/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { ManageReservationsComponent } from 'src/app/compartido/componentes/manage-reservations/manage-reservations.component';
import { ManageTripsComponent } from 'src/app/compartido/componentes/manage-trips/manage-trips.component';
import { ModalController } from '@ionic/angular';
import { Reservation } from 'src/app/models/reservation.model';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/servicios/utils.service';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  viajes = [];
  usuario: any;
  cars = [];
  allCars = [];
  misViajes = [];
  allTrips = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.fetchUserProfileAndLoadData();
  }

  ionViewWillEnter() {
    // This will run each time the page becomes active
    this.resetData();
    this.fetchUserProfileAndLoadData();
  }

  resetData() {
    // Reset data to clear previous user's data
    this.viajes = [];
    this.cars = [];
    this.allCars = [];
    this.misViajes = [];
    this.allTrips = [];
  }

  fetchUserProfileAndLoadData() {
    this.firebaseSvc.getUserProfile().subscribe((userProfile: User) => {
      if (userProfile && userProfile.uid) {
        this.usuario = userProfile;
  
        // Mueve esta parte aquí dentro del bloque if
        if (this.usuario.tipo === 'Conductor') {
          this.loadUserTrips();
        }
  
        this.loadAppropriateCarData(); // Mantén esta línea aquí
      } else {
        console.error('No user profile or UID found');
      }
    });
  }
  


  loadAppropriateCarData() {
    if (this.usuario.tipo === 'Conductor') {
      this.loadUserCars();
      this.loadUserTrips();
    } else if (this.usuario.tipo === 'Pasajero') {
      this.loadAllTrips();
    }
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

  loadUserTrips() {
    if (this.usuario && this.usuario.uid) {
      console.log('Loading trips for user ID:', this.usuario.uid);
      this.firebaseSvc.getTripsByUserId(this.usuario.uid).subscribe(trips => {
        console.log('Trips:', trips);
        this.misViajes = trips;
      }, error => {
        console.error('Error fetching trips:', error);
      });
    } else {
      console.error('No user ID available for loading trips');
    }
  }
  
  loadAllCars() {
    this.firebaseSvc.getAllCars().subscribe(cars => {
      this.allCars = cars;
    }, error => {
      console.error('Error fetching all cars:', error);
    });
  }
  
  loadAllTrips() {
    this.firebaseSvc.getAllTrips().subscribe(trips => {
      const carObservables: Observable<Car>[] = trips.map(trip => this.firebaseSvc.getCarDetails(trip.carId));
      const userObservables: Observable<User>[] = trips.map(trip => this.firebaseSvc.getUserDetails(trip.userId));

      forkJoin([...carObservables, ...userObservables]).subscribe(results => {
        const cars = results.slice(0, trips.length);
        const users = results.slice(trips.length);

        trips.forEach((trip, index) => {
          trip.car = cars[index] as Car;
          trip.user = users[index] as User;
        });

        this.allTrips = trips;
      });
    }, error => {
      console.error('Error al obtener todos los viajes:', error);
    });
  }
  
  
  getFormattedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  deleteTrip(tripId: string) {
    this.firebaseSvc.deleteTrip(tripId).then(() => {
      // Optionally, refresh the list of trips after deletion
      this.loadUserTrips();
    }).catch(error => {
      console.error('Error deleting trip:', error);
    });
  }
  


  async openManageTripsModal(selectedCar: Car) {
    const modal = await this.modalController.create({
      component: ManageTripsComponent,
      componentProps: {
        selectedCar: selectedCar
      }
    });
  
    return await modal.present();
  }

  async openReservationModal(selectedTrip: Trip) {
    const modal = await this.modalController.create({
      component: ManageReservationsComponent,
      componentProps: {
        selectedTrip: selectedTrip
      }
    });
  
    return await modal.present();
  }  

  reserveTrip(tripId: string) {
    const userId = this.firebaseSvc.getCurrentUserUID(); // Obtiene el ID del usuario actual
    const seatsToReserve = 1;

    this.firebaseSvc.createReservation(tripId, userId, seatsToReserve)
      .then(() => {
        console.log('Reserva realizada con éxito');
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de éxito
      })
      .catch(error => {
        console.error('Error al realizar la reserva:', error);
        // Maneja el error, por ejemplo, mostrando un mensaje al usuario
      });
  }
  async confirmDeleteCar(carId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este auto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Acciones a realizar si se hace clic en "Cancelar"
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Acciones a realizar si se hace clic en "Eliminar"
            this.deleteCar(carId);
          }
        }
      ]
    });
  
    await alert.present();
  }

  async confirmDeleteTrip(viajeId: string) {
    const alert = await this.alertController.create({
      header: '¿Finalizar Viaje?',
      message: '¿Estás seguro de que quieres finalizar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Acciones a realizar si se hace clic en "Cancelar"
          }
        },
        {
          text: 'Finalizar',
          handler: () => {
            // Acciones a realizar si se hace clic en "Eliminar"
            this.deleteTrip(viajeId);
          }
        }
      ]
    });
  
    await alert.present();
  }

}

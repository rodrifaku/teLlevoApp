import {  getAuth, signInWithEmailAndPassword , createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import {  getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc, where} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Car } from '../models/car.model';
import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Reservation } from '../models/reservation.model';
import { Trip } from '../models/trip.model';
import { UtilsService } from './utils.service';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


    auth = inject(AngularFireAuth);
    firestore = inject(AngularFirestore);
    utilsSvc = inject(UtilsService);
    storage = inject(AngularFireStorage);


  // ====== Autentificacion  ======
  getAuth(){
    return getAuth();
  }

//.......LOGIN...........

//.......LOGIN...........
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

//.......REGISTRAR...........
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

//.......ACTUALIZAR USUARIO...........
async updateUser(displayName: string): Promise<void> {
  const currentUser = getAuth().currentUser;

  if (currentUser) {
    try {
      await updateProfile(currentUser, { displayName });
      console.log('Perfil actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  } else {
    console.error('No hay usuario autenticado.');
  }
}

//.......ENVIAR EMAIL PARA RESTABLECER CONTRASEÑA...........
sendRecoveryEmail(email: string){
  return sendPasswordResetEmail(getAuth(), email);
}

//.......CERRAR SESION...........
signOut(){
  getAuth().signOut();
  localStorage.removeItem('user');
  this.utilsSvc.routerLink('/auth');
}

// ====== BASE DE DATOS  ======

//......Obtener un documento de una coleccion......
getCollectionData(path: string, collectionQuery?: any){
  const ref = collection(getFirestore(), path)
  return collectionData(query(ref, collectionQuery), {idField: 'uid'})
}

//......setear un documento......
setDocument(path:string, data: any){
  return setDoc(doc(getFirestore(), path),data);
}

//......actualizar un documento......
updateDocument(path:string, data: any){
  return updateDoc(doc(getFirestore(), path),data);
}

//......eliminar un documento......
deleteDocument(path:string){
  return deleteDoc(doc(getFirestore(), path));
}

//......Obtener un documento......
async getDocument(path: string){
  return await (await getDoc(doc(getFirestore(), path))).data();
}

//......Agregar un documento......
addDocument(path:string , data: any){
  return addDoc(collection(getFirestore(), path),data);

}

// ====== ALMACENAMIENTO ======

//......Subir Imagen......
async uploadImage(path: string, data_url: string){
  return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
    return getDownloadURL(ref(getStorage(),path))
  })
}

//......obtener ruta de la imagen  con su  url......
async getFilePath(url: string){
  return ref(getStorage(), url).fullPath
}

//......eliminar archivo......
deleteFile(path: string){
  return deleteObject(ref(getStorage(), path))
}
getUserProfile() {
 
  const user = getAuth().currentUser;
  if (user) {
    return this.firestore.collection('users').doc(user.uid).valueChanges();
  } else {
    return null;
  }
}

  // Método para añadir un nuevo auto
  addCar(newCar: Car) {
    return this.addDocument('cars', newCar);
  }

  // Método para obtener todos los autos
  getAllCars() {
    return this.getCollectionData('cars');
  }

  getAllTrips(): Observable<Trip[]> {
    return this.firestore.collection<Trip>('trips').valueChanges();
  }
   

  // Método para obtener un auto específico por ID
  getCarById(id: string) {
    return this.getDocument(`cars/${id}`);
  }

  // Método para actualizar un auto
  updateCar(id: string, updatedCar: Car) {
    return this.updateDocument(`cars/${id}`, updatedCar);
  }

  // Método para eliminar un auto
  deleteCar(carId: string) {
    return deleteDoc(doc(getFirestore(), `cars/${carId}`));
  }

  deleteTrip(tripId: string) {
    return deleteDoc(doc(getFirestore(), `trips/${tripId}`))
      .then(() => {
        // Opcionalmente, puedes realizar alguna acción después de la eliminación del viaje
        console.log('Trip deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting trip:', error);
      });
  }
  
  getCurrentUserUID(): string | null {
    const user = getAuth().currentUser;
    return user ? user.uid : null;
  }

  // Método para obtener los autos de un usuario específico
  getCarsByUserId(userId: string) {
    const carsRef = collection(getFirestore(), 'cars');
    const q = query(carsRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' });
  }

  getCarsWithAvailableSeats(): Observable<Car[]> {
    return this.firestore.collection<Car>('cars', ref => ref.where('asientosDisponibles', '>', 0))
      .valueChanges({ idField: 'id' });
  }

  bookCarTrip(carId: string, seats: number): Promise<void> {
    const carRef: DocumentReference = this.firestore.doc(`cars/${carId}`).ref;
    const tripRef: DocumentReference = this.firestore.collection('trips').ref.doc(); // Crear un nuevo documento de viaje

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const carDoc = await transaction.get(carRef);
      if (!carDoc.exists) {
        throw new Error("Car does not exist");
      }

      const newAvailableSeats = carDoc.data()['asientosDisponibles'] - seats;
      if (newAvailableSeats < 0) {
        throw new Error("Not enough seats available");
      }

      // Actualizar los asientos disponibles en el coche
      transaction.update(carRef, { asientosDisponibles: newAvailableSeats });

      // Crear un nuevo documento de viaje
      const tripData = { carId, seats, /* otros datos del viaje */ };
      transaction.set(tripRef, tripData);
    });
  }

  createTrip(tripData: Trip): Promise<void> {
    return this.firestore.collection('trips').add(tripData).then(() => {});
  }

  getTripsByUserId(userId: string) {
    const carsRef = collection(getFirestore(), 'trips');
    const q = query(carsRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' });
  }

  getTrips(): Observable<Trip[]> {
    return this.firestore.collection<Trip>('trips').valueChanges();
  }

  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>('users').valueChanges();
  }


  createReservation(reservationData: Reservation): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!reservationData.userId || !reservationData.tripId || 
          reservationData.seats == null || !reservationData.reservationDate) {
        reject(new Error('Missing required reservation fields'));
        return;
      }

      this.firestore.collection('reservations').add({
        userId: reservationData.userId,
        tripId: reservationData.tripId,
        seats: reservationData.seats,
        reservationDate: reservationData.reservationDate.toISOString(),
        ...(reservationData.trip && { trip: reservationData.trip }),
        ...(reservationData.user && { user: reservationData.user })
      })
      .then(docRef => {
        console.log('Reservation created with ID:', docRef.id);
        resolve();
      })
      .catch(error => {
        console.error('Error creating reservation:', error);
        reject(error);
      });
    });
  }
  
  getTripById(tripId: string): Observable<Trip> {
    return this.firestore.collection('trips').doc(tripId).valueChanges() as Observable<Trip>;
  }
  
  

  getCarDetails(carId: string): Observable<Car> {
    return this.firestore.collection('cars').doc(carId).get().pipe(
      map(doc => doc.data() as Car)
    );
  }

  getUserDetails(userId: string): Observable<User> {
    return this.firestore.collection('users').doc(userId).get().pipe(
      map(doc => doc.data() as User)
    );
  }

  getReservationsByUserId(userId: string): Observable<Reservation[]> {
    return this.firestore
      .collection<Reservation>('reservations', (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges();
  }

  getTripDetails(tripId: string): Observable<Trip> {
    // Reemplaza 'viajes' con el nombre real de la colección de viajes en tu base de datos
    const tripDoc = this.firestore.collection('viajes').doc(tripId);

    return tripDoc.valueChanges() as Observable<Trip>;
  }

}
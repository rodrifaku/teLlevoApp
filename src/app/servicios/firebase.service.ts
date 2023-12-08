import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {  getAuth, signInWithEmailAndPassword , createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail} from 'firebase/auth';
import {  getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { UtilsService } from './utils.service';


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

}
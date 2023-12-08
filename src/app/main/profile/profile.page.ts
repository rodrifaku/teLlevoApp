import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  usuario: User;

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.firebaseService.getUserProfile().subscribe(
      userProfile => {
        if (userProfile) {
          this.usuario = userProfile as User;
          console.log(this.usuario);
        } else {
          // Manejar el caso de no tener datos de usuario (por ejemplo, redirigir a la página de login)
          console.log('No hay datos de perfil de usuario disponibles');
        }
      },
      error => {
        console.error('Error al cargar el perfil de usuario:', error);
      }
    );
  }
}

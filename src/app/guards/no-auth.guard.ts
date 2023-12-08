import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../servicios/firebase.service';
import { UtilsService } from '../servicios/utils.service';


@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

   
    return new Promise((resolve)=> {

      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if(!auth) resolve(true);
        
        else
          this.utilsSvc.routerLink('/home');
          resolve(false);
      })
    });
  }
  
}

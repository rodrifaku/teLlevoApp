import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./main/home/home.module').then( m => m.HomePageModule), canActivate:[AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./main/profile/profile.module').then( m => m.ProfilePageModule), canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

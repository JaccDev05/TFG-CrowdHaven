import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './PagInicio/register/register.component';
import { LoginComponent } from './PagInicio/login/login.component';
import { VistaFeedComponent } from './Feed/components/vista-feed/vista-feed.component';

export const routes: Routes = [
  {
<<<<<<< HEAD
    path: '', 
    component: MainLayoutComponent, 
    //canActivate: [authGuard],
    children: [ 
      
=======
    path: "", component: MainLayoutComponent, children: [
      { path: '', component: VistaFeedComponent } // -> www.ejemplo.com
>>>>>>> c5104c418a9f46840614fcf7239f55ee1392cb99
     ]
  },
 
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, /*canActivate: [publicGuard] */},
      { path: 'register', component: RegisterComponent, /*canActivate: [publicGuard] */ },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
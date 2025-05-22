import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './PagInicio/register/register.component';
import { LoginComponent } from './PagInicio/login/login.component';
import { VistaFeedComponent } from './Feed/components/vista-feed/vista-feed.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
  {
    path: '', 
    component: MainLayoutComponent, 
    //canActivate: [authGuard],
    children: [ 
      { path: '', component: VistaFeedComponent},
      { path: 'perfil', component: PerfilComponent}
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
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './PagInicio/register/register.component';
import { LoginComponent } from './PagInicio/login/login.component';
import { VistaFeedComponent } from './Feed/components/vista-feed/vista-feed.component';
import { PostDetailsComponent } from './Feed/components/post-details/post-details.component';
import { UserFunctionsLayoutComponent } from './layout/user-functions-layout/user-functions-layout.component';
import { UserCommunitiesComponent } from './FuncionesSidebar/user-communities/user-communities.component';

export const routes: Routes = [
  {
    path: "", component: MainLayoutComponent, children: [
      { path: '', component: VistaFeedComponent }, // -> www.ejemplo.com
      {path: "posts/:id", component: PostDetailsComponent}
     ]
  },

  {
    path: "user", component: UserFunctionsLayoutComponent, children: [
      { path: 'comunidades-user/:id', component: UserCommunitiesComponent }, // -> www.ejemplo.com
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
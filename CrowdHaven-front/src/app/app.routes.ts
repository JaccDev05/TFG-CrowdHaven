import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { VistaFeedComponent } from './pages/posts/vista-feed/vista-feed.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistroComponent } from './pages/auth/registro/registro.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { PostCommentsComponent } from './pages/posts/post-comments/post-comments.component';
import { CreatePostComponent } from './pages/posts/create-post/create-post.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    //canActivate: [authGuard],
    children: [
      { path: '', component: VistaFeedComponent },
      { path: 'crear-post', component: CreatePostComponent },
      { path: 'posts/:postId/comments', component: PostCommentsComponent },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent/*, canActivate: [publicGuard]*/ },
      { path: 'registro', component: RegistroComponent/*, canActivate: [publicGuard]*/ },
    ],
  },
  { path: '**', component: PageNotFoundComponent },
];
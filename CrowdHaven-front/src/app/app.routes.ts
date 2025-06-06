import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './PagInicio/register/register.component';
import { LoginComponent } from './PagInicio/login/login.component';
import { VistaFeedComponent } from './Feed/components/vista-feed/vista-feed.component';
import { PerfilComponent } from './FuncionesSidebar/perfil/perfil.component';

import { PostDetailsComponent } from './Feed/components/post-details/post-details.component';
import { UserFunctionsLayoutComponent } from './layout/user-functions-layout/user-functions-layout.component';
import { UserCommunitiesComponent } from './FuncionesSidebar/user-communities/user-communities.component';
import { UserPostsComponent } from './FuncionesSidebar/user-posts/user-posts.component';
import { CommunityDetailsComponent } from './Feed/components/community-details/community-details.component';
import { RewardsShopComponent } from './FuncionesSidebar/rewards-shop/rewards-shop.component';
import { ChatComponent } from './FuncionesSidebar/chat/chat.component';
import { AuthGuard } from './PagInicio/loginservices/auth.guard';

export const routes: Routes = [
  {
    path: "", component: MainLayoutComponent, children: [
      { path: '', component: VistaFeedComponent }, // -> www.ejemplo.com
      {path: "posts/:id", component: PostDetailsComponent},
    ]
  },

  {
    path: "user", component: UserFunctionsLayoutComponent,    canActivate: [AuthGuard],
    children: [
      { path: ':userId/community/:communityId', component: CommunityDetailsComponent},      
      {path: 'posts-user/:id', component: UserPostsComponent},
      { path: "perfil/:id", component: PerfilComponent},
      {path: 'shop-rewards', component: RewardsShopComponent},
      {path: ':userId/chat', component: ChatComponent},
      {path: ':userId/chat/:id', component: ChatComponent},
      {path: 'comunidades-user/:id', component: UserCommunitiesComponent},
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
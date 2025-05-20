import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UserStateService } from '../../../PagInicio/loginservices/user-state.service';
import { TokenService } from '../../../api/auth-services/token.service';
import { CommonModule } from '@angular/common';
import { MenuSidebarComponent } from '../menu-sidebar/menu-sidebar.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    CommonModule,
    MenuSidebarComponent
  ],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isLoggedIn = false;
  username: string | null = null;
  sidebarOpen = false;
  showSidebar = false;



  constructor(
    private userStateService: UserStateService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkSession();
  }

  checkSession() {
    this.username = this.userStateService.getUsername();
    this.isLoggedIn = !!this.username && !!this.tokenService.getAccessToken();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Método para redirigir a la página de Register
  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }


  openMenu() {
    this.showSidebar = true;
    setTimeout(() => this.sidebarOpen = true, 10); // espera al render
  }
  
  closeMenu() {
    this.sidebarOpen = false;
    // Espera a que termine la animación (300ms) y lo elimina del DOM
    setTimeout(() => this.showSidebar = false, 300);
  }

/*
  logout() {
    this.tokenService.removeToken();
    this.userStateService.removeSession();
    this.isLoggedIn = false;
    this.username = null;
    this.router.navigate(['/login']);
  }
*/
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isActive: boolean = false;

  // Variables de tabs

  isActiveItems: any = {
    isActiveNotification: false,
    isActiveSettings: false,
  }

  constructor(
    private router: Router
  ) {}

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Método para redirigir a la página de Register
  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
  // isActiveNotification: boolean = false;

  /*toggleLogo() {
    this.isActive = !this.isActive;
    this.sidebarStatusService.changeStatus(this.isActive);
  }
  goToProfile() {
    this.router.navigate(['/app/perfil']);
  }
  toggleItem(option: string) {
    if (this.isActiveItems[option]) {
      this.isActiveItems[option] = false;
    }
    else {
      Object.keys(this.isActiveItems).forEach((item) => {
        this.isActiveItems[item] = false;
      })
      this.isActiveItems[option] = true;
    }
  }*/

}

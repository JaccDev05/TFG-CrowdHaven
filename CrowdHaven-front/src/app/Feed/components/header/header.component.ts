import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { UserStateService } from '../../../PagInicio/loginservices/user-state.service';
import { TokenService } from '../../../api/auth-services/token.service';
import { CommonModule } from '@angular/common';
import { MenuSidebarComponent } from '../menu-sidebar/menu-sidebar.component';
import { Community } from '../../../api/models/community.model';
import { CommunityService } from '../../../api/services/community/community.service';
import { User } from '../../../api/models/user.model';
import { UserService } from '../../../api/services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink,
    CommonModule,
    MenuSidebarComponent,
    FormsModule
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
  allCommunities: Community[] = [];
  filteredCommunities: Community[] = [];
  searchQuery = '';
  user!: User

  constructor(
    private userStateService: UserStateService,
    private tokenService: TokenService,
    private router: Router,
    private communityService: CommunityService,
private userService: UserService
  ) {}

  ngOnInit(): void {
    this.checkSession();
    this.getUser();
    this.communityService.getAllCommunities().subscribe(communities => {
      this.allCommunities = communities;
    });

   
  }

  checkSession() {
    this.username = this.userStateService.getUsername();
    this.isLoggedIn = !!this.username && !!this.tokenService.getAccessToken();
  }
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredCommunities = [];
  }

  onSearchChange(): void {
    const query = this.searchQuery.trim().toLowerCase();
  
    if (!query) {
      this.filteredCommunities = [];
      return;
    }
  
    this.filteredCommunities = this.allCommunities.filter(comm =>
      comm.name.toLowerCase().includes(query)
    );
  }

  getUser(): void {
    const name = this.userStateService.getUsername();
    if (!name) {
      return;
    }

    this.userService.getUserProfile(name).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }



  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

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

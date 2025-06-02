import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Community } from '../../../api/models/community.model';
import { CommunityService } from '../../../api/services/community/community.service';
import { UserStateService } from '../../../PagInicio/loginservices/user-state.service';
import { UserService } from '../../../api/services/user/user.service';
import { User } from '../../../api/models/user.model';

@Component({
  selector: 'app-sidebar-comunidades',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-comunidades.component.html',
  styleUrl: './sidebar-comunidades.component.scss'
})
export class SidebarComunidadesComponent implements OnInit {
  communities: Community[] = [];
  username: string | null = null;
  user!: User;                // Usuario logueado


  constructor(
    private communityService: CommunityService,
    private userStateService: UserStateService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.username = this.userStateService.getUsername();
    this.loadCommunities();
    this.getUser();
  }

  getUser(): void {
    const name = this.userStateService.getUsername();
    if (!name) {
      this.user = {} as User; // O null, si lo prefieres y actualizas el tipo
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

  loadCommunities(): void {
    this.communityService.getAllCommunities().subscribe((data) => {
      this.communities = data
        .sort((a, b) => b.members.length - a.members.length) // ordenar de mayor a menor
        .slice(0, 5); // solo las primeras 5
    });
  }  
}

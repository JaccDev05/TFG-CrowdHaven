import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Community } from '../../../api/models/community.model';
import { CommunityService } from '../../../api/services/community/community.service';
import { UserStateService } from '../../../PagInicio/loginservices/user-state.service'; // importa tu servicio

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

  constructor(
    private communityService: CommunityService,
    private userStateService: UserStateService
  ) {}

  ngOnInit(): void {
    this.username = this.userStateService.getUsername();
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.communityService.getAllCommunities().subscribe((data) => {
      this.communities = data;
    });
  }
}

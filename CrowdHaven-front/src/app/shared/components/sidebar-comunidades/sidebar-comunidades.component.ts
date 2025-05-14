import { Component, OnInit } from '@angular/core';
import { Community } from '../../../core/models/community.model';
import { CommunityService } from '../../../core/services/community/community.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-comunidades',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar-comunidades.component.html',
  styleUrl: './sidebar-comunidades.component.scss'
})

export class SidebarComunidadesComponent implements OnInit {
  communities: Community[] = [];

  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.communityService.getAllCommunities().subscribe((data) => {
      this.communities = data;
    });
  }
}
import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Community } from '../../../api/models/community.model';
import { CommunityService } from '../../../api/services/community/community.service';

@Component({
  selector: 'app-sidebar-comunidades',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-comunidades.component.html',
  styleUrl: './sidebar-comunidades.component.scss'
})

export class SidebarComunidadesComponent implements OnInit {
  communities: Community[] = [];

  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    //this.loadCommunities();
  }

  /*
  loadCommunities(): void {
    this.communityService.getAllCommunities().subscribe((data) => {
      this.communities = data;
    });
  }*/
}
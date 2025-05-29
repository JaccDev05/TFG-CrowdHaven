import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Community } from '../../api/models/community.model';
import { CommunityService } from '../../api/services/community/community.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberCommunityService } from '../../api/services/member-community/member-community.service';

@Component({
  selector: 'app-user-communities',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './user-communities.component.html',
  styleUrl: './user-communities.component.scss'
})
export class UserCommunitiesComponent implements OnInit {

  communities: Community[] = [];
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private comService: MemberCommunityService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const userId = parseInt(idParam, 10);
        this.loadCommunities(userId);
      }
    });
  }
  getId() {
     const userId = this.route.snapshot.paramMap.get('id');
     return userId
  }

  loadCommunities(userId: number): void {
    this.comService.getCommunitiesByUser(userId).subscribe((data) => {
      // Filtra comunidades duplicadas por ID
      const uniqueCommunities = data.filter((community, index, self) =>
        index === self.findIndex(c => c.id === community.id)
      );
  
      // Ordena por cantidad de miembros descendente
      this.communities = uniqueCommunities.sort((a, b) => b.members.length - a.members.length);
    });
  }
  
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Community } from '../../../api/models/community.model';
import { Post } from '../../../api/models/post.model';
import { CommunityService } from '../../../api/services/community/community.service';
import { PostService } from '../../../api/services/post/post.service';
import { MemberCommunityService } from '../../../api/services/member-community/member-community.service';
import { MemberCommunityDTO } from '../../../api/dtos/member-community-dto';
import { RoleService } from '../../../api/services/role/role.service';
import { PostDTO } from '../../../api/dtos/post-dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-community-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './community-details.component.html',
  styleUrl: './community-details.component.scss'
})
export class CommunityDetailsComponent implements OnInit {
  community: Community = {} as Community;
  posts: Post[] = [];
  communityId: number = 0;
  userId: number = 0;
  error: string | null = null;
  loading: boolean = true;
  isMember: boolean = false;
  joiningCommunity: boolean = false;
  newPost: PostDTO = {
    userId: 0,
    communityId: 0,
    title: '',
    content: '',
    image: ''
  };
  posting: boolean = false;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private postService: PostService,
    private memberCommunityService: MemberCommunityService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = Number(params['userId']);
      this.communityId = Number(params['communityId']);
      this.loadCommunityData();
      this.loadCommunityPosts();
      this.checkMembership();
    });
  }

  loadCommunityData(): void {
    this.communityService.getCommunityById(this.communityId).subscribe({
      next: (data) => {
        this.community = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la comunidad';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadCommunityPosts(): void {
    this.postService.getPostsByCommunity(this.communityId).subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => {
        this.error = 'Error al cargar las publicaciones';
        console.error(err);
      }
    });
  }

  checkMembership(): void {
    this.memberCommunityService.getCommunitiesByUser(this.userId).subscribe({
      next: (communities) => {
        this.isMember = communities.some(community => community.id === this.communityId);
      },
      error: (err) => {
        console.error('Error al verificar membresía', err);
      }
    });
  }

  joinCommunity(): void {
    if (this.joiningCommunity) return;
  
    this.joiningCommunity = true;
  
    this.roleService.getRolesByCommunity(this.communityId).subscribe({
      next: (roles) => {
        if (roles.length === 0) {
          console.error('No hay roles en la comunidad');
          this.joiningCommunity = false;
          return;
        }
  
        const firstRole = roles[0];
  
        const memberDTO: MemberCommunityDTO = {
          userId: this.userId,
          communityId: this.communityId,
          roleId: firstRole.id
        };
  
        this.memberCommunityService.addUserToCommunity(memberDTO).subscribe({
          next: () => {
            this.isMember = true;
            this.joiningCommunity = false;
            this.loadCommunityData();
          },
          error: (err) => {
            this.joiningCommunity = false;
            console.error('Error al unirse a la comunidad', err);
          }
        });
      },
      error: (err) => {
        this.joiningCommunity = false;
        console.error('Error al obtener roles de la comunidad', err);
      }
    });
  }
  

  leaveCommunity(): void {
    this.memberCommunityService.removeUserFromCommunity(this.userId, this.communityId).subscribe({
      next: () => {
        this.isMember = false;
        // Recargar
        this.loadCommunityData();
      },
      error: (err) => {
        console.error('Error al salir de la comunidad', err);
      }
    });
  }

  submitPost(): void {
    if (!this.newPost.title || !this.newPost.content) return;
  
    this.posting = true;
    this.newPost.userId = this.userId;
    this.newPost.communityId = this.communityId;
  
    this.postService.createPost(this.newPost).subscribe({
      next: (createdPost) => {
        this.posts.unshift(createdPost); // Añadirlo arriba
        this.newPost = { userId: this.userId, communityId: this.communityId, title: '', content: '', image: '' };
        this.posting = false;
      },
      error: (err) => {
        console.error('Error al crear el post', err);
        this.posting = false;
      }
    });
  }
  

  likePost(postId: number): void {
    this.postService.updatePostReaction(postId, true).subscribe({
      next: (updatedPost) => {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      },
      error: (err) => {
        console.error('Error al dar like', err);
      }
    });
  }

  dislikePost(postId: number): void {
    this.postService.updatePostReaction(postId, false).subscribe({
      next: (updatedPost) => {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
      },
      error: (err) => {
        console.error('Error al dar dislike', err);
      }
    });
  }

  commentOnPost(postId: number): void {
    this.router.navigate([`/posts/${postId}`]);
  }
}
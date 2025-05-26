import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Community } from '../../../api/models/community.model';
import { Post } from '../../../api/models/post.model';
import { CommunityService } from '../../../api/services/community/community.service';
import { PostService } from '../../../api/services/post/post.service';

@Component({
  selector: 'app-community-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './community-details.component.html',
  styleUrl: './community-details.component.scss'
})
export class CommunityDetailsComponent implements OnInit {
  community: Community | null = null;
  posts: Post[] = [];
  communityId: number = 0;
  error: string | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communityService: CommunityService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.communityId = Number(params['id']); //pa extraer el id de la URLy pasarlo a number 
      this.loadCommunityData();
      this.loadCommunityPosts();
    });
  }

  loadCommunityData(): void {
    this.communityService.getCommunityById(this.communityId).subscribe({
      next: (data) => {
        //this.posts = data.filter(post => post.community.id === this.communityId);
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
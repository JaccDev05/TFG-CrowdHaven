import { Component } from '@angular/core';
import { Post } from '../../api/models/post.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../api/services/post/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-posts',
  imports: [CommonModule,
    RouterLink
  ],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.scss'
})
export class UserPostsComponent {

  posts: Post[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const userId = parseInt(idParam, 10);
        this.loadPosts(userId);
      }
    });
  }

  loadPosts(userId: number): void {
    this.postService.getPostsByUser(userId).subscribe((data) => {
      this.posts = data;
    });
  }

  likePost(postId: number): void {
    this.postService.updatePostReaction(postId, true).subscribe({
      next: (updatedPost) => {
        // Actualizar solo el post afectado en la lista local
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


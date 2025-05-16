import { Component, OnInit } from '@angular/core';
import { Post } from '../../../api/models/post.model';
import { PostService } from '../../../api/services/post/post.service';
import { Router } from '@angular/router';
//import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vista-feed',
  imports: [CommonModule],
    //providers: [DatePipe],
  templateUrl: './vista-feed.component.html',
  styleUrl: './vista-feed.component.scss'
})

export class VistaFeedComponent implements OnInit {
  posts: Post[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los posts', err);
        this.error = 'No se pudieron cargar las publicaciones.';
        this.loading = false;
      }
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
      this.router.navigate([`/posts/${postId}/comments`]);
  }
  

  crearPost(): void {
    this.router.navigate(['/crear-post']);
  }
}

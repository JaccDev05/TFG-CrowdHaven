import { Component, OnInit } from '@angular/core';
import { Post } from '../../../api/models/post.model';
import { PostService } from '../../../api/services/post/post.service';
import { Router } from '@angular/router';
//import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { SidebarComunidadesComponent } from '../sidebar-comunidades/sidebar-comunidades.component';

@Component({
  selector: 'app-vista-feed',
  imports: [CommonModule,
    SidebarComunidadesComponent
  ],
    //providers: [DatePipe],
  templateUrl: './vista-feed.component.html',
  styleUrl: './vista-feed.component.scss'
})

export class VistaFeedComponent implements OnInit {
  posts: Post[] = [];
  error: string | null = null;

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
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

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PostService } from '../../../api/services/post/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../api/models/post.model';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../api/services/comment/comment.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-details',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent implements OnInit {
 
  post : Post  | null = null;
  username: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private commentService: CommentService,
    private cd: ChangeDetectorRef


  ) {}
  
  ngOnInit(): void {
    this.loadPost();
  }

  loadPost(): void {
    const postId = this.route.snapshot.paramMap.get('id');  
    if (postId) {
      this.postService.getPostById(parseInt(postId)).subscribe(post => {
        this.post = post;
      });
    }
  }

  likePost(postId: number): void {
  this.postService.updatePostReaction(postId, true).subscribe({
    next: (updatedPost) => {
      this.post = updatedPost;
    },
    error: (err) => {
      console.error('Error al dar like', err);
    }
  });
}

dislikePost(postId: number): void {
  this.postService.updatePostReaction(postId, false).subscribe({
    next: (updatedPost) => {
      this.post = updatedPost;
    },
    error: (err) => {
      console.error('Error al dar dislike', err);
    }
  });
}

reactToComment(commentId: number, isLike: boolean): void {
  if (!this.post || !this.post.comments) return;

  this.commentService.updateCommentReaction(commentId, isLike).subscribe({
    next: (updatedComment) => {
      const index = this.post!.comments!.findIndex(c => c.id === commentId);
      if (index !== -1) {
        const updatedComments = [...this.post!.comments!];
        updatedComments[index] = updatedComment;

        this.post = {
          ...(this.post as Post),
          comments: updatedComments
        };

        this.cd.detectChanges();
      }
    },
    error: (err) => {
      console.error(`Error al ${isLike ? 'dar like' : 'dar dislike'} al comentario`, err);
    }
  });
}

likeComment(commentId: number): void {
  this.reactToComment(commentId, true);
}

dislikeComment(commentId: number): void {
  this.reactToComment(commentId, false);
}



}

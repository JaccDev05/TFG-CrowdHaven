import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PostService } from '../../../api/services/post/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../api/models/post.model';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../api/services/comment/comment.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../api/models/user.model';
import { UserService } from '../../../api/services/user/user.service';
import { UserStateService } from '../../../PagInicio/loginservices/user-state.service';
import { PopupService } from '../../../PagInicio/loginservices/popup.service';

@Component({
  selector: 'app-post-details',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent implements OnInit {
 
  post : Post  | null = null;
  username: string | null = null;
  commentForm!: FormGroup;
  user!: User;
  


  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private commentService: CommentService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private userService: UserService,
    private userStateService: UserStateService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.loadPost();
    this.loadUser();
    this.commentForm = this.fb.group({
      content: ['', Validators.required] // Este es el input text
    });
  }


  createComment(): void {
    if (!this.user) return;

    const CommentDTO = {
      userId: this.user.id,
      communityId: this.post!.community!.id,
      postId: this.post!.id,
      content: this.commentForm.value.content
    };

    this.commentService.createComment(CommentDTO).subscribe({
      next: () => {

        const dto = {
          email: this.user?.email,
          username: this.user?.username,
          avatar: this.user?.avatar,
          crowdCoin: this.user.crowdCoin + 20
        };

        this.userService.updateCrowdCoins(this.user.id, dto).subscribe();

        this.popupService.showMessage(
          '¡Comentario creado!',
          'Tu comentario ha sido creado con éxito,  has ganado  +15 CrowdCoins',
          'success'
        );
        this.commentForm.reset();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (err) => {
        this.popupService.close();
            this.popupService.showMessage(
              'Ups, ocurrió un error',
              'No se pudo crear el comentario. Inténtalo más tarde.',
              'error'
            );
        console.error('Error al crear comentario', err);
      }
    })
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

loadUser(): void {
  const username = this.userStateService.getUsername();
  if (username) {
    this.userService.getUserProfile(username).subscribe(data => {
      this.user = data;
    });
  }
}

getUsername(): string | null {
  const username = this.userStateService.getUsername();
  return username
}

}

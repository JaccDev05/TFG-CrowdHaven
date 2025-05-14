import { Component, OnInit } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post/post.service';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feed',
  imports: [],
  //providers: [DatePipe],
  standalone: true,
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data;
    });
  }
  likePost(postId: number): void {
  }


  commentOnPost(postId: number): void {
  }

}
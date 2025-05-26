import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostDTO } from '../../dtos/post-dto';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/posts';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getPostsByCommunity(communityId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/community/${communityId}`);
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`);
  }

  createPost(postDTO: PostDTO): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postDTO);
  }

  updatePost(postId: number, PostDTO: PostDTO): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, PostDTO);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePostReaction(id: number, isLike: boolean): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}/reaction?isLike=${isLike}`, {});
  }

  likePost(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/like`, {});
  }

  dislikePost(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/dislike`, {});
  }
}

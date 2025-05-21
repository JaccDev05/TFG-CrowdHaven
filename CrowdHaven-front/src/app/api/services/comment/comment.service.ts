import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/comments';

  constructor(private http: HttpClient) {}

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  /*
  createComment(commentDTO: CommentDTO): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, commentDTO);
  }*/

  updateCommentReaction(id: number, isLike: boolean): Observable<Comment> {
      return this.http.put<Comment>(`${this.apiUrl}/${id}/reaction?isLike=${isLike}`, {});
    }
    

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${commentId}`);
  }


  likeComment(commentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${commentId}/reaction`, {});
  }
  
  dislikeComment(commentId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${commentId}/reaction`, {});
  }
}

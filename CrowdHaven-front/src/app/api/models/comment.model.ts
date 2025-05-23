import { User } from './user.model'; 
import { Post } from './post.model'; 

export interface Comment {
  id: number;
  user: User;
  post: Post;
  content: string;
  like_count: number;
  dislike_count: number;
  createdAt: string;
}

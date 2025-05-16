import { User } from './user.model'; 
import { Post } from './post.model'; 

export interface Comment {
  id: number;
  user: User;
  post: Post;
  content: string;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
}

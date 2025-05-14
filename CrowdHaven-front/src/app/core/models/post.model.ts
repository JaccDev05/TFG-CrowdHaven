import { User } from './user.model';
import { Community } from './community.model';
import { Comment } from './comment.model';

export interface Post {
  id: number;
  user: User;
  community: Community;
  title: string;
  content: string;
  image: string;
  likeCount: number;
  dislikeCount: number;
  comments: Comment[];
  createdAt: Date; //no string, si no no funciona la pipe Date
}

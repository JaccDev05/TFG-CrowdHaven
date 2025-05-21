import { User } from './user.model';
import { Role } from './role.model';

export interface Community {
  id: number;
  name: string;
  description: string;
  img_photo: string;
  img_banner: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  members: User[];
}

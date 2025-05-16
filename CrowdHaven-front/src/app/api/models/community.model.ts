import { User } from './user.model';
import { Role } from './role.model';

export interface Community {
  id: number;
  name: string;
  description: string;
  imgPhoto: string;
  imgBanner: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  members: User[];
}

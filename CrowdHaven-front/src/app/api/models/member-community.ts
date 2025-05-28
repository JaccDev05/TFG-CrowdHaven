import { Community } from "./community.model";
import { Role } from "./role.model";
import { User } from "./user.model";

export interface MemberCommunity {
    id: number;
    user: User;
    community: Community;
    role: Role
    joinedAt: string; 
  }
  
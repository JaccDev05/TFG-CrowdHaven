import { User } from "./user.model";
import { Role } from "./role.model";

export interface LoginRequest {
  username: string;
  password: string;
}

/*export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  nombre_completo: string;
  role_id: number;
}*/

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  role: Role;
}



//export type LoginInterface = Pick<UserInterface, "username" | "password">

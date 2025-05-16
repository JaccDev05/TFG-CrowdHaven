export interface UserInterface {

  username: string;
  password: string;
  avatar: string | null;
  email: string;
  crowdcoin: number;
}


export type LoginInterface = Pick<UserInterface, "username" | "password">
export type RegisterInterface = Omit<UserInterface,  "avatar, crowdcoin" >

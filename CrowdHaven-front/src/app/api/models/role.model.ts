export interface Role {
    id: number;
    roleName: string;
    //community: string;
    community: {
        id: number;
        name: string;
      };
  }
  
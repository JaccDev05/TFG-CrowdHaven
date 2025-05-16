import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private readonly USER_KEY = "crowdH";

  constructor() { }

save(username: string): void  {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify({username}));
  }

  getUsername(): string | null {
    const session = JSON.parse(<string>sessionStorage.getItem(this.USER_KEY));
    if (!session) {
      return null;
    }

    return session.username;
  }

  removeSession(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }
}

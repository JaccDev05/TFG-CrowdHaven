import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  private readonly USER_KEY = "crowdH";
  //private readonly LOGGED_USERS_KEY = "logged_users";
  
  private currentUser = new BehaviorSubject<string | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor() {
    const username = this.getUsername();
    this.currentUser.next(username);
  }

  save(username: string): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify({ username }));
    this.currentUser.next(username);
  }

  getUsername(): string | null {
    const session = JSON.parse(<string>sessionStorage.getItem(this.USER_KEY));
    if (!session) {
      return null;
    }
    return session.username;
  }

  updateUsername(newUsername: string): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify({ username: newUsername }));
    this.currentUser.next(newUsername);
  }

  removeSession(): void {
    sessionStorage.removeItem(this.USER_KEY);
    this.currentUser.next(null);
  }
}
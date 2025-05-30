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

  save(username: string): void  {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify({username}));
    this.currentUser.next(username);//Actualizar observable con el nuevo usuario  }
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
    this.currentUser.next(null);
  }
}

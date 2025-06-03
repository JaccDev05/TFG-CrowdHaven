import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {}

  canActivate(): boolean {
    const username = this.userStateService.getUsername();

    if (username) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}


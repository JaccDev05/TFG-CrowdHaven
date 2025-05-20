import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import { TokenService } from '../auth-services/token.service';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { UserStateService } from '../../PagInicio/loginservices/user-state.service';

export const authGuard: CanActivateFn = async (route, state) => {

  const tokenService = inject(TokenService);
  const userStateService = inject(UserStateService);
  const router = inject(Router);
  const http = inject(HttpClient);

  const accessToken = tokenService.getAccessToken();
  const refreshToken = tokenService.getRefreshToken();

  if (!accessToken) {
    router.navigate(['/login']);
    return false;
  }

  const username = userStateService.getUsername();
  
  try {
    const response: any = await firstValueFrom(
      http.post(`${environment.apiUrl}/users/check-token`, {
        username,
        token: accessToken,
      })
    )

    return true;
  } catch (error) {
    // tokenService.removeToken()
    router.navigate(['/login']);
    return false;
  }
};

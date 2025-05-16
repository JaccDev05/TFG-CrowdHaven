import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, AuthResponse } from '../../core/models/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(
    private http: HttpClient,
  ) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/users/login`, credentials)
  }

  register(userData: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/users/register`, userData)
  }

  changePassword(username: string, payload: { username: string; currentPassword: string; newPassword: string; }, newPassword: any) {
    return this.http.post<{ message: string }>('/api/auth/change-password', payload);
  }
  
  //checktoken()?
  /*
  checkToken(checkTokenRequest: CheckTokenRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-token`, checkTokenRequest);
  }
  */
}

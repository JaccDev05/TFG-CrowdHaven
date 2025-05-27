import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserDTO } from '../../dtos/user-dto';
import { CrowDTO } from '../../dtos/crowd-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getUserProfile(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/name/${username}`);
  }

  updateUser(id: number, userUp: UserDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userUp);
  }

  updateCrowdCoins(id: number, userUp: CrowDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userUp);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  //metodos login, register y checktoken en /core/auth-services/credentials.service.ts
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Community } from '../../models/community.model';
import { MemberCommunity } from '../../models/member-community';
import { MemberCommunityDTO } from '../../dtos/member-community-dto';

@Injectable({
  providedIn: 'root',
})
export class MemberCommunityService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/members';

  constructor(private http: HttpClient) {}

  // Ver todos los usuarios de una comunidad
  getUsersByCommunity(communityId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/community/${communityId}`);
  }

  // Ver todas las comunidades de un usuario
  getCommunitiesByUser(userId: number): Observable<Community[]> {
    return this.http.get<Community[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Añadir usuario a comunidad
  addUserToCommunity(dto: MemberCommunityDTO): Observable<MemberCommunity> {
    return this.http.post<MemberCommunity>(`${this.apiUrl}`, dto);
  }

  // Eliminar usuario de comunidad
  removeUserFromCommunity(userId: number, communityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}/${communityId}`);
  }

  // Asignar rol a un miembro
  assignRoleToMember(userId: number, communityId: number, roleId: number): Observable<MemberCommunity> {
    return this.http.put<MemberCommunity>(
      `${this.apiUrl}/${userId}/${communityId}/${roleId}`, {}
    );
  }
}

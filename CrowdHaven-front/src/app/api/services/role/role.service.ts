import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../models/role.model';
import { RoleDTO } from '../../dtos/role-dto';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/roles';

  constructor(private http: HttpClient) {}

  getRolesByCommunity(communityId: number): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/community/${communityId}`);
  }

  addRoleToCommunity(roleDTO: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.apiUrl, roleDTO);
  }

  updateRole(id: number, roleDTO: RoleDTO): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, roleDTO);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

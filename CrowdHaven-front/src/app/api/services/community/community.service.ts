import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Community } from '../../models/community.model';
import { CommunityDTO } from '../../dtos/community-dto';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/communities';

  constructor(private http: HttpClient) {}

  getAllCommunities(): Observable<Community[]> {
    return this.http.get<Community[]>(this.apiUrl);
  }

  getCommunityById(id: number): Observable<Community> {
    return this.http.get<Community>(`${this.apiUrl}/${id}`);
  }

  createCommunity(communityDTO: CommunityDTO): Observable<CommunityDTO> {
    return this.http.post<CommunityDTO>(`${this.apiUrl}/create`, communityDTO);
  }

  updateCommunity(comId: number, community: Community): Observable<Community> {
    return this.http.put<Community>(`${this.apiUrl}/update/${comId}`, community);
  }

  deleteCommunity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getCommunitiesByUser(userId: number): Observable<Community[]> {
    return this.http.get<Community[]>(`${this.apiUrl}/user/${userId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward } from '../../models/reward.model';

@Injectable({
  providedIn: 'root',
})
export class RewardService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/rewards';

  constructor(private http: HttpClient) {}

  getAllRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(this.apiUrl);
  }

  getRewardById(id: number): Observable<Reward> {
    return this.http.get<Reward>(`${this.apiUrl}/getRew/${id}`);
  }
/*
  createReward(rewardDTO: RewardDTO): Observable<Reward> {
    return this.http.post<Reward>(this.apiUrl, rewardDTO);
  }
*/
  deleteReward(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RewardPurchase } from '../../models/reward-purchase.model';
import { Observable } from 'rxjs';
import { RewardPurchaseDTO } from '../../dtos/rew-Purchase-dto';

@Injectable({
  providedIn: 'root'
})
export class RewardPurchaseService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/reward-purchases';


  constructor(private http: HttpClient) {}



  buyReward(rewardPurchase: RewardPurchaseDTO): Observable<RewardPurchaseDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<RewardPurchaseDTO>(this.apiUrl, rewardPurchase);
  }


  getRewardPurchaseById(id: number): Observable<RewardPurchase[]> {
      return this.http.get<RewardPurchase[]>(`${this.apiUrl}/user/${id}`);
    }


    deleteRewardPurchaseById(id: number): Observable<RewardPurchase> {
      return this.http.delete<RewardPurchase>(`${this.apiUrl}/${id}`);
    }
}


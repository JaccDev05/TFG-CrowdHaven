import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RewardPurchase } from '../../models/reward-purchase.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RewardPurchaseService {
  private apiUrl = 'http://localhost:8080/CrowdHaven/reward-purchases';


  constructor(private http: HttpClient) {}



  buyReward(rewardPurchase: RewardPurchase): Observable<RewardPurchase> {
    return this.http.post<RewardPurchase>(this.apiUrl, rewardPurchase);
  }

  getRewardPurchaseById(id: number): Observable<RewardPurchase[]> {
      return this.http.get<RewardPurchase[]>(`${this.apiUrl}/user/${id}`);
    }

    deleteRewardPurchaseById(id: number): Observable<RewardPurchase> {
      return this.http.delete<RewardPurchase>(`${this.apiUrl}/${id}`);
    }
}


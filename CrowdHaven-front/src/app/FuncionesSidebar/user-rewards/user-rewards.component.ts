import { Component, OnInit } from '@angular/core';
import { RewardPurchase } from '../../api/models/reward-purchase.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RewardPurchaseService } from '../../api/services/rew-purchase/reward-purchase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-rewards',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './user-rewards.component.html',
  styleUrl: './user-rewards.component.scss'
})
export class UserRewardsComponent implements OnInit {

  rewardPurchases: RewardPurchase [] = [];

  constructor(
    private route: ActivatedRoute,
    private rewardPurchaseService: RewardPurchaseService
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const userId = parseInt(idParam, 10);
        this.loadRewPurch(userId);
      }
    });
  }


  loadRewPurch(userId: number): void {
    this.rewardPurchaseService.getRewardPurchaseById(userId).subscribe((data) => {
      this.rewardPurchases = data;
    })

  }

  goToRewardsShop() {
    window.location.href = '/rewards';
  }
}

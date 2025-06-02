import { Component, OnInit } from '@angular/core';
import { Reward } from '../../api/models/reward.model';
import { RewardService } from '../../api/services/reward/reward.service';
import { CommonModule } from '@angular/common';
import { User } from '../../api/models/user.model';
import { UserService } from '../../api/services/user/user.service';
import { UserStateService } from '../../PagInicio/loginservices/user-state.service';
import { RewardPurchaseService } from '../../api/services/rew-purchase/reward-purchase.service';
import { PopupService } from '../../PagInicio/loginservices/popup.service';

@Component({
  selector: 'app-rewards-shop',
  imports: [CommonModule],
  templateUrl: './rewards-shop.component.html',
  styleUrl: './rewards-shop.component.scss'
})
export class RewardsShopComponent implements OnInit {

  user!: User;
  rewards: Reward[] = [];
  userPurchases: string[] = []; // Guarda los nombres de recompensas compradas

  constructor(
    private rewardService: RewardService,
    private userStateService: UserStateService,
    private userService: UserService,
    private rewardServ: RewardPurchaseService,
    private popupService: PopupService,

  ) { }



  ngOnInit(): void {
    this.loadRewards();
    this.loadUser();
  }

  loadRewards(): void {
    this.rewardService.getAllRewards().subscribe(data => {
      this.rewards = data.sort((a, b) => a.price - b.price);
    })
  }

  loadUser(): void {
    const username = this.userStateService.getUsername();
    if (username) {
      this.userService.getUserProfile(username).subscribe(data => {
        this.user = data;
        this.loadUserPurchases(); // Nuevo

      });
    }
  }

  loadUserPurchases(): void {
    const username = this.getUsername();
    if (username) {
      this.rewardServ.getRewardPurchaseById(this.user.id).subscribe(data => {
        this.userPurchases = data.map(p => p.reward.name); // Asumimos que `reward` es el nombre
      });
    }
  }

  getUsername(): string | null {
    const username = this.userStateService.getUsername();

    return username
  }

  buyReward(reward: Reward): void {
    if (!this.user) return;
  
    const rewardAlreadyPurchased = this.userPurchases.includes(reward.name);
  
    if (rewardAlreadyPurchased) {
      this.popupService.showMessage(
        'Recompensa ya comprada',
        `Ya has comprado la recompensa "${reward.name}".`,
        'info'
      );
      return;
    }
  
    const rewardPurchase = {
      user: this.getUsername(),
      reward: reward.name,
    };
  
    if (this.user.crowdCoin >= reward.price) {
      this.popupService.loader("Comprando recompensa...", "Espere un momento");
  
      setTimeout(() => {
        this.rewardServ.buyReward(rewardPurchase).subscribe({
          next: (res) => {
            this.popupService.close();
            this.popupService.showMessage(
              '¡Compra exitosa!',
              `Has comprado la recompensa "${reward.name}" por ${reward.price} CrowdCoin$.`,
              'success'
            );
  
            const dto = {
              email: this.user.email,
              username: this.user.username,
              crowdCoin: this.user.crowdCoin - reward.price
            };
  
            this.userService.updateCrowdCoins(this.user.id, dto).subscribe();
  
            // Añadir el reward a la lista local (sin recargar)
            this.userPurchases.push(reward.name);
            this.user.crowdCoin -= reward.price;
          },
          error: (err) => {
            this.popupService.close();
            this.popupService.showMessage(
              'Ups, ocurrió un error',
              'No se pudo completar la compra. Inténtalo más tarde.',
              'error'
            );
            console.error('Error al comprar recompensa:', err);
          }
        });
      }, 1500);
    } else {
      this.popupService.showMessage(
        'Fondos insuficientes',
        'No tienes suficientes CrowdCoin$ para comprar esta recompensa.',
        'warning'
      );
    }
  }
  
  
  

}

import { Reward } from "./reward.model";
import { User } from "./user.model";

export interface RewardPurchase {
    id: number;
    user: User;
    reward: Reward;
    total: number;
    purchasedAt: Date;

}
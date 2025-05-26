import { Reward } from "./reward.model"
import { User } from "./user.model"

export interface RewardPurchase  {

    user: User
    reward: Reward
    total: number
    purchasedAt: Date
}
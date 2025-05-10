package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.RewardPurchaseDTO;
import com.CrowdHaven.Backend.models.Reward;
import com.CrowdHaven.Backend.models.RewardPurchase;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.repositories.RewardPurchaseRepository;
import com.CrowdHaven.Backend.repositories.RewardRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RewardPurchaseService {
    private final UserRepository userRepository;
    private final RewardRepository rewardRepository;
    private final RewardPurchaseRepository rewardPurchaseRepository;

    public RewardPurchase buyReward(RewardPurchaseDTO rewardPurchaseDTO) {

        //Post
        Optional<User> user = this.userRepository.findByUsername(rewardPurchaseDTO.getUser());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        Optional<Reward> reward = rewardRepository.findByName(rewardPurchaseDTO.getReward());

        if (reward.isEmpty()) {
            throw new IllegalArgumentException("reward no encontrado");
        }

        RewardPurchase rewardPurchase = new RewardPurchase();

        rewardPurchase.setUser(user.get());
        rewardPurchase.setReward(reward.get());
        rewardPurchase.setTotal(reward.get().getPrice());

        return rewardPurchaseRepository.save(rewardPurchase);

    }
    public List<RewardPurchase> getPurchaseByUserId(Long userId) {
        return rewardPurchaseRepository.findByUserId(userId);
    }

    public void deletePurchases(Long id){
        this.rewardPurchaseRepository.deleteById(id);
    }
}


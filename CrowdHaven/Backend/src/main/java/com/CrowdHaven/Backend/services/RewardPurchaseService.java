package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.RewardPurchaseDTO;
import com.CrowdHaven.Backend.models.RewardPurchase;
import com.CrowdHaven.Backend.repositories.RewardPurchaseRepository;
import com.CrowdHaven.Backend.repositories.RewardRepository;
import com.CrowdHaven.Backend.repositories.RewardTypeRepository;
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

    public RewardPurchase createRewardPurchase(RewardPurchaseDTO rewardPurchaseDTO) {

        if (!this.userRepository.existsByUsername(rewardPurchaseDTO.getUser().getUsername())) {
            throw new IllegalArgumentException("no existe el user");
        } else {

            RewardPurchase rewardPurchase = new RewardPurchase();

            rewardPurchase.setUser(this.userRepository.findById(rewardPurchaseDTO.getUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("No se encontró el user")));

            rewardPurchase.setReward(this.rewardRepository.
                    findByRewName(rewardPurchaseDTO.getReward().getName())
                    .orElseThrow(() -> new IllegalArgumentException("No se encontró la reward")));

            this.rewardPurchaseRepository.save(rewardPurchase);
            return rewardPurchase;
        }
    }

    public List<RewardPurchase> getAllPurchases() {
        return rewardPurchaseRepository.findAll();
    }

    public Optional<RewardPurchase> getPurchasesById (Long id) {
        return this.rewardPurchaseRepository.findById(id);
    }

    public void deletePurchases(Long id){
        this.rewardPurchaseRepository.deleteById(id);
    }
}


package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.RewardDTO;
import com.CrowdHaven.Backend.models.Reward;
import com.CrowdHaven.Backend.repositories.RewardPurchaseRepository;
import com.CrowdHaven.Backend.repositories.RewardRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;
    private final RewardPurchaseRepository rewardPurchaseRepository;

    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }

    public Optional<Reward> getRewardsById(Long rewardId) {
        return rewardRepository.findById(rewardId);
    }

    public Reward createReward(RewardDTO rewardFromFront) {

        if(this.rewardRepository.existsByName(rewardFromFront.getName())){
            throw new IllegalArgumentException("Reward Already Exists");
        }

        else {
            /*RewardType type = this.rewardTypeRepository.findByRewTypeName(rewardFromFront.getType()).orElseThrow(
                    () -> new IllegalArgumentException("Role no permitido")
            );*/


            Reward reward = new Reward();
            reward.setName(rewardFromFront.getName());
            reward.setRewardType(rewardFromFront.getRewardType());
            reward.setDescription(rewardFromFront.getDescription());
            reward.setPrice(rewardFromFront.getPrice());

            this.rewardRepository.save(reward);
            return reward;
        }
    }




    public void deleteReward(Long id) {
        rewardRepository.deleteById(id);
    }
}

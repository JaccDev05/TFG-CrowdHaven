package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.RewardDTO;
import com.CrowdHaven.Backend.models.Reward;
import com.CrowdHaven.Backend.repositories.RewardRepository;
import com.CrowdHaven.Backend.repositories.RewardTypeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RewardService {

    private final RewardRepository rewardRepository;
    private final RewardTypeRepository rewardTypeRepository;

    public List<Reward> getAllRewards() {
        return rewardRepository.findAll();
    }

    public List<Reward> getRewardsByUserID(Long userId) {
        return rewardRepository.findByUserId(userId); // Llama al repositorio para obtener los productos
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

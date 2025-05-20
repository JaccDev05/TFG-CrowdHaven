package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.RewardDTO;
import com.CrowdHaven.Backend.models.Reward;
import com.CrowdHaven.Backend.services.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")

@RestController
@RequestMapping("/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public List<Reward> getAllRewards() {
        return rewardService.getAllRewards();
    }
    @GetMapping ("/getRew/{rewId}")
    public Reward getById(@PathVariable Long rewId) {
        return rewardService.getRewardsById(rewId).orElseThrow(()
                -> new IllegalArgumentException("Reward no encontrada"));
    }

    // Crear recompensa
    @PostMapping
    public Reward createReward(@RequestBody RewardDTO rewardDTO) {
        return rewardService.createReward(rewardDTO);
    }

    // Eliminar recompensa
    @DeleteMapping("/{id}")
    public void deleteReward(@PathVariable Long id) {
        rewardService.deleteReward(id);
    }
}


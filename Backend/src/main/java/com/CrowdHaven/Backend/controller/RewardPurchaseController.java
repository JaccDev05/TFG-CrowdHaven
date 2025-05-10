package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.RewardPurchaseDTO;
import com.CrowdHaven.Backend.models.RewardPurchase;
import com.CrowdHaven.Backend.services.RewardPurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reward-purchases")
@RequiredArgsConstructor
public class RewardPurchaseController {

    private final RewardPurchaseService rewardPurchaseService;


    // Ver mis recompensas (compras por userId)
    @GetMapping("/user/{userId}")
    public List<RewardPurchase> getRewardPurchasesByUser(@PathVariable Long userId) {
        return rewardPurchaseService.getPurchaseByUserId(userId);
    }

    // Comprar una recompensa
    @PostMapping
    public RewardPurchase createRewardPurchase(@RequestBody RewardPurchaseDTO rewardPurchaseDTO) {
        return rewardPurchaseService.buyReward(rewardPurchaseDTO);
    }

    // Eliminar compra de recompensa
    @DeleteMapping("/{id}")
    public void deleteRewardPurchase(@PathVariable Long id) {
        rewardPurchaseService.deletePurchases(id);
    }
}


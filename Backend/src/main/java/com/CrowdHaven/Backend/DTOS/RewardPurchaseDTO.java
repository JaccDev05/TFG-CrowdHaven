package com.CrowdHaven.Backend.DTOS;

import com.CrowdHaven.Backend.models.Reward;
import com.CrowdHaven.Backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RewardPurchaseDTO {

    private User user;
    private Reward reward;
}

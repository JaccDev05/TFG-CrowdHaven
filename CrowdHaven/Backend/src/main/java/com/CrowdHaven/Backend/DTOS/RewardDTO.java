package com.CrowdHaven.Backend.DTOS;

import com.CrowdHaven.Backend.models.Reward;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RewardDTO {

    private String name;
    private String description;
    private String rewardType;

    private double price;
    private String type;
}

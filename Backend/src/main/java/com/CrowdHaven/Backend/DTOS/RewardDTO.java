package com.CrowdHaven.Backend.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RewardDTO {

    private String name;
    private String description;
    private String rewardType;
    private BigDecimal price;
}

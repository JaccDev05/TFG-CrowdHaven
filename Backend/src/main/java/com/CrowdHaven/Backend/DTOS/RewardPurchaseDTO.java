package com.CrowdHaven.Backend.DTOS;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RewardPurchaseDTO {

    private String user;
    private String reward;
    private BigDecimal total;

}

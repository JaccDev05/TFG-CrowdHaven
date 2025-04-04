package com.CrowdHaven.Backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "reward_purchase")
@Data
public class RewardPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "reward_id", nullable = false)
    private Reward reward;

    @Column(nullable = false)
    private LocalDateTime purchasedAt = LocalDateTime.now();
}

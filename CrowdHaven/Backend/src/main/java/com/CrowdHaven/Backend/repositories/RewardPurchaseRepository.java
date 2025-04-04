package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.RewardPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardPurchaseRepository extends JpaRepository<RewardPurchase, Long> {
}

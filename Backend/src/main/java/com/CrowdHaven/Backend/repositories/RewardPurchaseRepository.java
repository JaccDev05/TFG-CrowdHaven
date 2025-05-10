package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.RewardPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardPurchaseRepository extends JpaRepository<RewardPurchase, Long> {
    // Obtener recompensas compradas por un usuario
    List<RewardPurchase> findByUserId(Long userId);
}

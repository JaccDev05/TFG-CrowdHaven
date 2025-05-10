package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    // Buscar recompensa por tipo
    List<Reward> findByRewardType(String rewardType);

    boolean existsByName(String name);

    Optional<Reward> findByName(String name);
}
package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Reward;
import com.CrowdHaven.Backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    Optional<Reward> findByRewName (String name);

    List<Reward> findByUserId(Long userId);

    boolean existsByName(String name);

}

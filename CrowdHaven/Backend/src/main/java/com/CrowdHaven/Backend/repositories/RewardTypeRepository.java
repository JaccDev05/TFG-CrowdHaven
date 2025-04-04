package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Reward;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RewardTypeRepository {
    Optional<Reward> findByRewTypeName (String name);

}

package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    // Obtener comunidades por el ID del creador
    List<Community> findByUserId(Long userId);

    boolean existsByName(String name);
    Optional<Community>findByName(String name);
}

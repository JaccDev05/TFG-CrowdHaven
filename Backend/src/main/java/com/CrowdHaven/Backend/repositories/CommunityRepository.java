package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository <Community, Long> {
    Optional<Community> findByName (String name);
    //List<Community> findByUserID (Long id);
    boolean existsByName(String name);


}

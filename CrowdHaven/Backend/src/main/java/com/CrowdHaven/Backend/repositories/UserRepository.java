package com.CrowdHaven.Backend.repositories;

import aj.org.objectweb.asm.commons.Remapper;
import com.CrowdHaven.Backend.models.Community;
import com.CrowdHaven.Backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsById(Long aLong);
}

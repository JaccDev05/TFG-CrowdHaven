package com.CrowdHaven.Backend.repositories;


import com.CrowdHaven.Backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Buscar usuario por nombre de usuario
    Optional<User> findByUsername(String username);


    boolean existsByUsername(String username);
}

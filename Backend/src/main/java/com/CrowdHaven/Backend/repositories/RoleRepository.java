package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Obtener todos los roles de una comunidad
    List<Role> findByCommunityId(Long communityId);
    Optional<Role> findByRoleName(String roleName);

}
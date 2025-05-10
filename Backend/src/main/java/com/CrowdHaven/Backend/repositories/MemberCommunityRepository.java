package com.CrowdHaven.Backend.repositories;


import com.CrowdHaven.Backend.models.Member_Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberCommunityRepository extends JpaRepository<Member_Community, Long> {


    // Obtener todos los usuarios de una comunidad

    List<Member_Community> findByCommunityId(Long communityId);

    // Obtener todas las comunidades a las que pertenece un usuario
    List<Member_Community> findByUserId(Long userId);

    void deleteByUserIdAndCommunityId(Long userId, Long communityId);

    Optional<Member_Community> findByUserIdAndCommunityId(Long userId, Long communityId);
}
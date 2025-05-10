package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Obtener todos los posts de una comunidad
    List<Post> findByCommunityId(Long communityId);

    // Obtener todos los posts de un usuario
    List<Post> findByUserId(Long userId);
}

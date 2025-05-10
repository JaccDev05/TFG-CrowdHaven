package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.Comment;
import com.CrowdHaven.Backend.models.Member_Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Obtener todos los comentarios de un post
    List<Comment> findByPostId(Long postId);
}

package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.CommentDTO;
import com.CrowdHaven.Backend.models.Comment;
import com.CrowdHaven.Backend.models.User;
import com.CrowdHaven.Backend.repositories.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CommentService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final MemberCommunityRepository memberCommunityRepository;



    public List<Comment> getCommentsByPostID(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment createComment(CommentDTO commentFromFront) {

        if(this.memberCommunityRepository.findByUserIdAndCommunityId(commentFromFront.getUserId(),
                commentFromFront.getCommunityId()).isEmpty()) {
            throw new IllegalArgumentException("No pertenece a la comunidad");

        }
        else {

            User user = this.userRepository.findById(commentFromFront.getUserId()).
                    orElseThrow(()-> new IllegalArgumentException("no existe el user"));

            Comment comment = new Comment();

            comment.setUser(user);
            comment.setContent(commentFromFront.getContent());
            comment.setLike_count(0);
            comment.setDislike_count(0);
            comment.setPost(this.postRepository.findById(commentFromFront.getPostId())
                    .orElseThrow(() -> new IllegalArgumentException("No se encontró el post")));


            this.commentRepository.save(comment);
            return comment;
        }
    }

    public Comment updateCommentReaction(Long id, boolean isLike) {
        Optional<Comment> existingComment = commentRepository.findById(id);

        if (existingComment.isEmpty()) {
            throw new IllegalArgumentException("Comentario no encontrado");
        }

        Comment comment = existingComment.get();

        if (isLike) {
            comment.setLike_count(comment.getLike_count() + 1);
        } else {
            comment.setDislike_count(comment.getDislike_count() + 1);
        }

        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}



package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.CommentDTO;
import com.CrowdHaven.Backend.models.Comment;
import com.CrowdHaven.Backend.models.Post;
import com.CrowdHaven.Backend.repositories.CommentRepository;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.PostRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CommentService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;



    public List<Comment> getCommentsByPostID(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment createComment(CommentDTO commentFromFront) {

        if(!this.userRepository.existsByUsername(commentFromFront.getUser())){
            throw new IllegalArgumentException("No existe el user");
        }

        else {

            Comment comment = new Comment();

            comment.setContent(commentFromFront.getContent());
            comment.setLike(0);
            comment.setDislike(0);
            comment.setPost (this.postRepository.findById(commentFromFront.getPost_Id())
                    .orElseThrow(() -> new IllegalArgumentException("No se encontró el post")));

            comment.setCommunity(this.communityRepository.
                    findByName(commentFromFront.getCommunity()).get());


            this.commentRepository.save(comment);
            return comment;
        }
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}



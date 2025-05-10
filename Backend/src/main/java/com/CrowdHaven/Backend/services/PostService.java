package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.PostDTO;
import com.CrowdHaven.Backend.models.*;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.MemberCommunityRepository;
import com.CrowdHaven.Backend.repositories.PostRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PostService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final MemberCommunityRepository memberCommunityRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

   public List<Post> getPostsByCommunity(Long communityId) {
        return postRepository.findByCommunityId(communityId);
   }

    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByUserId(userId); // Llama al repositorio para obtener los productos
    }

    public Optional<Post> getPostById(Long postId) {
        return postRepository.findById(postId);
    }


    public Post createPost(PostDTO postFromFront) {
        // Validar usuario
        User user = userRepository.findById(postFromFront.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Validar comunidad
        Community community = communityRepository.findById(postFromFront.getCommunityId())
                .orElseThrow(() -> new IllegalArgumentException("Comunidad no encontrada"));

        // Validar que el usuario pertenezca a la comunidad
        boolean isMember = memberCommunityRepository
                .findByUserIdAndCommunityId(user.getId(), community.getId())
                .isPresent();

        if (!isMember) {
            throw new IllegalArgumentException("El usuario no pertenece a la comunidad");
        }

        Post post = new Post();
        post.setUser(user);
        post.setCommunity(community);
        post.setTitle(postFromFront.getTitle());
        post.setContent(postFromFront.getContent());
        post.setImage(postFromFront.getImage());

        post = postRepository.save(post);

        return post;
    }


    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public Post updatePostReaction(Long id, boolean isLike) {

        Optional<Post> existingPost = postRepository.findById(id);

        if (existingPost.isEmpty()) {
            throw new IllegalArgumentException("Comentario no encontrado");
        }

        Post post = existingPost.get();

        if (isLike) {
            post.setLike_count(post.getLike_count() + 1);
        } else {
            post.setDislike_count(post.getDislike_count() + 1);
        }

        return postRepository.save(post);
    }
}

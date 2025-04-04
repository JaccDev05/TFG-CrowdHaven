package com.CrowdHaven.Backend.services;

import com.CrowdHaven.Backend.DTOS.PostDTO;
import com.CrowdHaven.Backend.models.Post;
import com.CrowdHaven.Backend.repositories.CommunityRepository;
import com.CrowdHaven.Backend.repositories.PostRepository;
import com.CrowdHaven.Backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PostService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByUserID(Long userId) {
        return postRepository.findByUserId(userId); // Llama al repositorio para obtener los productos
    }

    public List<Post> getPostsByCommunityID(Long communityId) {
        return postRepository.findByCommunityId(communityId); // Llama al repositorio para obtener los productos
    }

    public Post createPost(PostDTO postFromFront) {

        if(!this.userRepository.existsByUsername(postFromFront.getUser())){
            throw new IllegalArgumentException("No existe el user");
        }

        else {

            Post post = new Post();

            post.setUser(this.userRepository.findByUsername(postFromFront.getUser()).get());
            post.setCommunity(this.communityRepository.findByName(postFromFront.getCommunity()).get());
            post.setTitle(postFromFront.getTitle());
            post.setContent(postFromFront.getContent());
            post.setImage(postFromFront.getImage());

            this.postRepository.save(post);
            return post;
        }
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}

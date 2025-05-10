package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.PostDTO;
import com.CrowdHaven.Backend.models.Post;
import com.CrowdHaven.Backend.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // Obtener todos los posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // Obtener posts por comunidad
    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<Post>> getPostsByCommunity(@PathVariable Long communityId) {
        return ResponseEntity.ok(postService.getPostsByCommunity(communityId));
    }

    // Obtener posts por usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getPostsByUser(userId));
    }

    // Obtener post por ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear un nuevo post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostDTO postDTO) {
        Post createdPost = postService.createPost(postDTO);
        return ResponseEntity.ok(createdPost);
    }

    // Eliminar un post por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // Reaccionar a un post (like o dislike)
    @PutMapping("/{id}/reaction")
    public ResponseEntity<Post> updateReaction(
            @PathVariable Long id,
            @RequestParam boolean isLike
    ) {
        Post updatedPost = postService.updatePostReaction(id, isLike);
        return ResponseEntity.ok(updatedPost);
    }
}
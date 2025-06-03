package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.CommentDTO;
import com.CrowdHaven.Backend.models.Comment;
import com.CrowdHaven.Backend.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@CrossOrigin("*")

public class CommentController {

    private final CommentService commentService;

    // Obtener todos los comentarios de un post específico
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPostID(postId);
        return ResponseEntity.ok(comments);
    }
    @GetMapping("/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByUserId(@PathVariable Long userId) {
        List<Comment> comments = commentService.getByUserId(userId);
        return ResponseEntity.ok(comments);
    }

    // Crear un nuevo comentario
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody CommentDTO commentDTO) {
        Comment createdComment = commentService.createComment(commentDTO);
        return ResponseEntity.ok(createdComment);
    }

    // Actualizar las reacciones (like/dislike) de un comentario
    @PutMapping("/{commentId}/reaction")
    public ResponseEntity<Comment> updateReaction(
            @PathVariable Long commentId,
            @RequestParam boolean isLike
    ) {
        Comment updatedComment = commentService.updateCommentReaction(commentId, isLike);
        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(
                commentId);
        return ResponseEntity.noContent().build();
    }
}
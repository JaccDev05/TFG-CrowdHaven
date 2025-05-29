package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.models.ChatMessage;
import com.CrowdHaven.Backend.repositories.ChatMessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*")
public class ChatController {

    private final ChatMessageRepository repository;

    public ChatController(ChatMessageRepository repository) {
        this.repository = repository;
    }

    // Obtener historial entre 2 usuarios
    @GetMapping("/history/{user1Id}/{user2Id}")
    public List<ChatMessage> getChatHistory(
            @PathVariable Long user1Id,
            @PathVariable Long user2Id) {

        return repository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
                user1Id, user2Id, user1Id, user2Id
        );
    }

    // Enviar un mensaje
    @PostMapping("/send")
    public ChatMessage sendMessage(@RequestBody ChatMessage message) {
        message.setTimestamp(java.time.LocalDateTime.now());
        return repository.save(message);
    }
}
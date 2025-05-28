package com.CrowdHaven.Backend.controller;

import com.CrowdHaven.Backend.DTOS.ChatMessageDTO;
import com.CrowdHaven.Backend.models.ChatMessage;
import com.CrowdHaven.Backend.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*")

public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository messageRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatMessageRepository messageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
    }

    @MessageMapping("/send")
    public void processMessage(ChatMessageDTO messageDTO) {
        ChatMessage message = new ChatMessage();
        message.setSenderId(messageDTO.senderId);
        message.setReceiverId(messageDTO.receiverId);
        message.setContent(messageDTO.content);
        messageRepository.save(message);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(messageDTO.receiverId),
                "/queue/messages",
                messageDTO
        );
    }

    @GetMapping("/history/{user1Id}/{user2Id}")
    public List<ChatMessage> getChatHistory(@PathVariable Long user1Id, @PathVariable Long user2Id) {
        return messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(user1Id, user2Id, user1Id, user2Id);
    }
}
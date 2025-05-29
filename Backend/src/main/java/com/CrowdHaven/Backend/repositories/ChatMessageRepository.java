package com.CrowdHaven.Backend.repositories;

import com.CrowdHaven.Backend.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
            Long senderId1, Long receiverId1, Long senderId2, Long receiverId2
    );
}

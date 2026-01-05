package org.example.case_study_module_6.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDTO {
    private Long id;
    private Long conversationId;
    
    private Long senderId;
    private String senderUsername;
    private String senderRole;
    
    private Long receiverId;
    private String receiverUsername;
    private String receiverRole;
    
    private String content;
    private LocalDateTime createdAt;
    private boolean readStatus;
    
    public static ChatResponseDTO fromEntity(org.example.case_study_module_6.entity.ChatMessage msg) {
        return ChatResponseDTO.builder()
                .id(msg.getId())
                .conversationId(msg.getConversation().getId())
                .senderId(msg.getSender().getId())
                .senderUsername(msg.getSenderUsername())
                .senderRole(msg.getSenderRole())
                .receiverId(msg.getReceiver().getId())
                .receiverUsername(msg.getReceiverUsername())
                .receiverRole(msg.getReceiverRole())
                .content(msg.getContent())
                .createdAt(msg.getCreatedAt())
                .readStatus(msg.isReadStatus())
                .build();
    }
}

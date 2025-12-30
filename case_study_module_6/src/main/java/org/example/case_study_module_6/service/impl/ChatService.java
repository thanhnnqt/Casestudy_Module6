package org.example.case_study_module_6.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.ChatMessageDTO;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.ChatMessage;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.repository.IChatMessageRepository;
import org.example.case_study_module_6.service.IChatService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final IChatMessageRepository chatRepo;
    private final IAccountRepository accountRepo;

    public void send(ChatMessageDTO dto, Principal principal) {

        // 🔐 Check quyền đơn giản
        if ("CUSTOMER".equals(dto.getSenderRole())
                && "CUSTOMER".equals(dto.getReceiverRole())) {
            throw new RuntimeException("Customer không chat với customer");
        }
        Account sender = accountRepo.findById(dto.getSenderId()).orElseThrow();
        Account receiver = accountRepo.findById(dto.getReceiverId()).orElseThrow();
        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .senderUsername(dto.getSenderUsername())
                .senderRole(dto.getSenderRole())
                .receiver(receiver)
                .receiverUsername(dto.getReceiverUsername())
                .receiverRole(dto.getReceiverRole())
                .content(dto.getContent())
                .createdAt(LocalDateTime.now())
                .readStatus(false)
                .build();

        chatRepo.save(message);

        // ⭐ GỬI THEO USERNAME (CHUẨN)
        messagingTemplate.convertAndSendToUser(
                dto.getReceiverUsername(),
                "/queue/messages",
                message
        );
    }
}

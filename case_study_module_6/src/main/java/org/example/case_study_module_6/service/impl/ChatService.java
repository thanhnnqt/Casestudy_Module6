package org.example.case_study_module_6.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.ChatMessageDTO;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.ChatMessage;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.repository.IChatMessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.example.case_study_module_6.entity.ChatConversation;
import org.example.case_study_module_6.repository.IChatConversationRepository;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final IChatMessageRepository chatRepo;
    private final IAccountRepository accountRepo;
    private final IChatConversationRepository conversationRepo;

    public void send(ChatMessageDTO dto, Principal principal) {
        try {
            System.out.println("ChatService: Start processing send. DTO: " + dto.getContent());

            // 1. Lấy thông tin sender
            Account sender = accountRepo.findById(dto.getSenderId())
                    .orElseThrow(() -> new RuntimeException("Sender not found: " + dto.getSenderId()));

            // 2. Xác định Customer ID
            Long customerAccountId = "CUSTOMER".equals(dto.getSenderRole())
                    ? dto.getSenderId() : dto.getReceiverId();
            // 3. Tìm/Tạo hội thoại
            ChatConversation conversation = conversationRepo.findByCustomerId(customerAccountId)
                    .orElseGet(() -> {
                        ChatConversation newConv = new ChatConversation();
                        newConv.setCustomer(accountRepo.findById(customerAccountId).orElseThrow());
                        if (!"CUSTOMER".equals(dto.getSenderRole())) {
                            newConv.setStaff(sender);
                            newConv.setStaffRole(dto.getSenderRole());
                        }
                        return conversationRepo.save(newConv);
                    });
            // 4. Xác định receiver (KHÔNG HARDCODE ID 1)
            Account receiver;
            if ("CUSTOMER".equals(dto.getSenderRole())) {
                if (conversation.getStaff() != null) {
                    receiver = conversation.getStaff();
                } else {
                    // ⭐ TÌM ADMIN BẤT KỲ NẾU ID 1 KHÔNG CÓ
                    receiver = accountRepo.findById(dto.getReceiverId()).orElseGet(() ->
                            accountRepo.findAll().stream()
                                    .filter(a -> a.getUsername().toLowerCase().contains("admin"))
                                    .findFirst()
                                    .orElse(sender) // Fallback
                    );
                }
            } else {
                receiver = accountRepo.findById(dto.getReceiverId()).orElseThrow();
            }
            // 5. Lưu và Gửi
            ChatMessage message = ChatMessage.builder()
                    .conversation(conversation).sender(sender).senderUsername(sender.getUsername())
                    .senderRole(dto.getSenderRole()).receiver(receiver).receiverUsername(receiver.getUsername())
                    .receiverRole(dto.getReceiverRole()).content(dto.getContent())
                    .createdAt(LocalDateTime.now()).readStatus(false).build();
            chatRepo.save(message);
            System.out.println("ChatService: Persisted message " + message.getId() + ". Sending to " + receiver.getUsername());
            messagingTemplate.convertAndSendToUser(receiver.getUsername(), "/queue/messages", message);

        } catch (Exception e) {
            System.err.println("ChatService ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e; // Đẩy lên để socket controller thấy
        }
    }

    public List<ChatMessage> getHistory(Long customerAccountId) {
        return conversationRepo.findByCustomerId(customerAccountId)
                .map(conv -> chatRepo.findByConversationIdOrderByCreatedAtAsc(conv.getId()))
                .orElse(java.util.Collections.emptyList()); // ⭐ Trả về list trống thay vì throw lỗi
    }
}

package org.example.case_study_module_6.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.ChatMessageDTO;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.ChatMessage;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.repository.IChatConversationRepository;
import org.example.case_study_module_6.repository.IChatMessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.example.case_study_module_6.entity.ChatConversation;
import org.example.case_study_module_6.dto.ChatResponseDTO;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final IChatMessageRepository chatRepo;
    private final IAccountRepository accountRepo;
    private final IChatConversationRepository conversationRepo;
    private final AccountService accountService;

    public void send(ChatMessageDTO dto, Principal principal) {
        try {
            System.out.println("ChatService: Start processing send from Principal: " + principal.getName());

            // 1. Lấy thông tin sender từ Principal (Tin tưởng tuyệt đối)
            Account sender = accountRepo.findByUsername(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Sender not found: " + principal.getName()));

            // 2. Xác định Customer Account ID (Gốc của hội thoại)
            // Nếu là Customer gửi -> ID là của tôi. Nếu là Staff gửi -> ID là của đối phương (receiver).
            Long customerAccountId;
            if ("CUSTOMER".equals(dto.getSenderRole())) {
                customerAccountId = sender.getId();
            } else {
                customerAccountId = dto.getReceiverId();
            }

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

            // 4. Xác định receiver
            Account receiver = null;
            if ("CUSTOMER".equals(dto.getSenderRole())) {
                // Customer gửi cho staff (nếu đã có người hỗ trợ)
                if (conversation.getStaff() != null) {
                    receiver = conversation.getStaff();
                } else {
                    // Nếu chưa có staff, thử lấy receiverId từ DTO NHƯNG phải kiểm tra đó có phải ADMIN không
                    if (dto.getReceiverId() != null) {
                        Optional<Account> target = accountRepo.findById(dto.getReceiverId());
                        if (target.isPresent() && "ADMIN".equals(accountService.resolveRole(target.get().getId()))) {
                            receiver = target.get();
                        }
                    }
                    
                    // Nếu vẫn chưa tìm được receiver hợp lệ (hoặc receiverId là null), tìm Admin bất kỳ
                    if (receiver == null) {
                        receiver = accountRepo.findAllAdmins().stream()
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("No admin found to receive message"));
                    }
                }
            } else {
                // Staff gửi cho customer
                receiver = accountRepo.findById(dto.getReceiverId())
                        .orElseThrow(() -> new RuntimeException("Receiver not found"));
            }

            // 5. Lưu và Gửi
            ChatMessage message = ChatMessage.builder()
                    .conversation(conversation).sender(sender).senderUsername(sender.getUsername())
                    .senderRole(dto.getSenderRole()).receiver(receiver).receiverUsername(receiver.getUsername())
                    .receiverRole(dto.getReceiverRole()).content(dto.getContent())
                    .createdAt(LocalDateTime.now()).readStatus(false).build();

            chatRepo.save(message);
            System.out.println("ChatService: Saved message. Preparing delivery...");

            ChatResponseDTO response = ChatResponseDTO.fromEntity(message);
            response.setSenderFullName(accountService.getDisplayName(sender.getId()));
            response.setReceiverFullName(accountService.getDisplayName(receiver.getId()));

            // ⭐ GỬI TIN NHẮN ĐI
            if ("CUSTOMER".equals(dto.getSenderRole()) && conversation.getStaff() == null) {
                // Nếu là khách hàng mới chat (chưa có staff), gửi cho TẤT CẢ admin
                List<Account> admins = accountRepo.findAllAdmins();
                System.out.println("ChatService: Broadcasting to " + admins.size() + " admins");
                for (Account admin : admins) {
                    messagingTemplate.convertAndSendToUser(admin.getUsername(), "/queue/messages", response);
                }
            } else {
                // Nếu đã có staff hoặc là staff đang trả lời, gửi cho receiver đích danh
                System.out.println("ChatService: Sending private to " + receiver.getUsername());
                messagingTemplate.convertAndSendToUser(receiver.getUsername(), "/queue/messages", response);
            }

        } catch (Exception e) {
            System.err.println("ChatService ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<ChatResponseDTO> getHistory(Long customerAccountId) {
        return conversationRepo.findByCustomerId(customerAccountId)
                .map(conv -> chatRepo.findByConversationIdOrderByCreatedAtAsc(conv.getId())
                        .stream().map(msg -> {
                            ChatResponseDTO res = ChatResponseDTO.fromEntity(msg);
                            res.setSenderFullName(accountService.getDisplayName(msg.getSender().getId()));
                            res.setReceiverFullName(accountService.getDisplayName(msg.getReceiver().getId()));
                            return res;
                        }).toList())
                .orElse(java.util.Collections.emptyList());
    }
}

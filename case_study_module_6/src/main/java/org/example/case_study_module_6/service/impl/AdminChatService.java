package org.example.case_study_module_6.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.CustomerChatSummaryDTO;
import org.example.case_study_module_6.entity.*;
import org.example.case_study_module_6.repository.*;
import org.example.case_study_module_6.service.IAccountService;
import org.example.case_study_module_6.service.IAdminChatService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminChatService implements IAdminChatService {

    private final IChatMessageRepository chatRepo;
    private final IAccountRepository accountRepo;
    private final ICustomerRepository customerRepo;
    private final IEmployeeRepository employeeRepo;
    private final IAdminRepository adminRepo;
    private final IAccountService accountService;

    @Override
    public List<CustomerChatSummaryDTO> getCustomerInbox() {
        List<Account> customers = chatRepo.findAllCustomersInConversations();

        List<CustomerChatSummaryDTO> result = new ArrayList<>();

        for (Account acc : customers) {
            CustomerChatSummaryDTO dto = new CustomerChatSummaryDTO();
            dto.setCustomerAccountId(acc.getId());
            dto.setCustomerUsername(acc.getUsername());
            
            // Lấy tên thật
            dto.setCustomerFullName(accountService.getDisplayName(acc.getId()));

            // Đếm số tin nhắn chưa đọc từ customer này
            long unreadCount = chatRepo.countUnreadMessagesForAdmin(acc.getId());
            dto.setUnreadCount(unreadCount);
            dto.setHasUnread(unreadCount > 0);

            // Tạm thời
            dto.setLastMessage("Nhấn để xem hội thoại");

            result.add(dto);
        }
        return result;
    }

    public void markMessagesAsRead(Long customerId, Long adminId) {
        // Sử dụng query khớp với logic đếm tin nhắn chưa đọc
        // Đánh dấu TẤT CẢ tin nhắn từ customer gửi cho ADMIN (không phân biệt admin nào nhận)
        List<ChatMessage> unreadMessages = chatRepo.findUnreadMessagesFromCustomerToAdmin(customerId);
        
        System.out.println("=== MARK AS READ DEBUG ===");
        System.out.println("Customer ID: " + customerId);
        System.out.println("Found unread messages: " + unreadMessages.size());
        
        unreadMessages.forEach(m -> {
            System.out.println("Marking message ID " + m.getId() + " as read");
            m.setReadStatus(true);
        });
        
        chatRepo.saveAll(unreadMessages);
        System.out.println("Saved " + unreadMessages.size() + " messages as read");
        System.out.println("=========================");
    }

    private Long getCurrentAccountId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        String username = auth.getName();
        return accountRepo.findByUsername(username)
                .map(Account::getId)
                .orElse(null);
    }
}

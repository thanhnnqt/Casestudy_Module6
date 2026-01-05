package org.example.case_study_module_6.controller;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.CustomerChatSummaryDTO;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.service.impl.AdminChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminChatController {

    private final AdminChatService adminChatService;
    private final IAccountRepository accountRepository;

    @GetMapping("/customers")
    public List<CustomerChatSummaryDTO> getCustomerInbox() {
        return adminChatService.getCustomerInbox();
    }

    @PostMapping("/mark-read/{customerId}")
    public ResponseEntity<?> markAsRead(@PathVariable Long customerId) {
        // Không cần adminId nữa vì logic mới đánh dấu TẤT CẢ tin nhắn từ customer cho ADMIN
        adminChatService.markMessagesAsRead(customerId, null);
        return ResponseEntity.ok().build();
    }
}
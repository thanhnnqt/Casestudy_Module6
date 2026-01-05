package org.example.case_study_module_6.controller;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.CustomerChatSummaryDTO;
import org.example.case_study_module_6.service.impl.AdminChatService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/chat")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminChatController {

    private final AdminChatService adminChatService;

    @GetMapping("/customers")
    public List<CustomerChatSummaryDTO> getCustomerInbox() {
        return adminChatService.getCustomerInbox();
    }
}
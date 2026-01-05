package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.service.IAdminChatService;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.CustomerChatSummaryDTO;
import org.example.case_study_module_6.repository.IChatMessageRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminChatService implements IAdminChatService {

    private final IChatMessageRepository chatRepo;

    @Override
    public List<CustomerChatSummaryDTO> getCustomerInbox() {

        // 🔑 LẤY ADMIN ID TỪ TOKEN
        Long adminId = getCurrentAccountId();

        List<Account> customers =
                chatRepo.findDistinctCustomersChatWithAdmin(adminId);

        List<CustomerChatSummaryDTO> result = new ArrayList<>();

        for (Account acc : customers) {
            CustomerChatSummaryDTO dto = new CustomerChatSummaryDTO();
            dto.setCustomerAccountId(acc.getId());
            dto.setCustomerUsername(acc.getUsername());

            // tạm thời
            dto.setLastMessage("Nhấn để xem hội thoại");
            dto.setHasUnread(false);

            result.add(dto);
        }
        return result;
    }

    private Long getCurrentAccountId() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return (Long) auth.getPrincipal();
    }
}

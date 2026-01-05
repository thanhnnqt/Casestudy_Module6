package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.CustomerChatSummaryDTO;

import java.util.List;

public interface IAdminChatService {
    public List<CustomerChatSummaryDTO> getCustomerInbox();
    public void markMessagesAsRead(Long customerId, Long adminId);
}

package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.ChatMessageDTO;

import java.security.Principal;

public interface IChatService {
    public void send(ChatMessageDTO dto, Principal principal);
}

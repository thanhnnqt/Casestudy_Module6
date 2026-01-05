package org.example.case_study_module_6.controller;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.ChatMessageDTO;
import org.example.case_study_module_6.entity.ChatMessage;
import org.example.case_study_module_6.service.impl.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatSocketController {

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void send(ChatMessageDTO dto, Principal principal) {
        chatService.send(dto, principal);
    }

    @GetMapping("/api/chat/history/{customerId}")
    public List<org.example.case_study_module_6.dto.ChatResponseDTO> getHistory(@PathVariable Long customerId) {
        return chatService.getHistory(customerId);
    }
}

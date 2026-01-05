package org.example.case_study_module_6.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ChatMessageDTO {

    private Long senderId;
    private String senderUsername;
    private String senderRole;

    private Long receiverId;
    private String receiverUsername;
    private String receiverRole;

    private String content;
}

package org.example.case_study_module_6.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerChatSummaryDTO {

    private Long customerAccountId;
    private String customerUsername;
    private String customerFullName;

    private String lastMessage;
    private boolean hasUnread;
}
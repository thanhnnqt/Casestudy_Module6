package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== CONVERSATION =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private ChatConversation conversation;

    // ===== SENDER =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_account_id", nullable = false)
    private Account sender;

    @Column(name = "sender_username", nullable = false)
    private String senderUsername;

    @Column(name = "sender_role", nullable = false)
    private String senderRole;

    // ===== RECEIVER =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_account_id", nullable = false)
    private Account receiver;

    @Column(name = "receiver_username", nullable = false)
    private String receiverUsername;

    @Column(name = "receiver_role", nullable = false)
    private String receiverRole;

    // ===== CONTENT =====
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // ===== STATUS =====
    @Column(name = "read_status")
    private boolean readStatus = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}

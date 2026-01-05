package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IChatMessageRepository
        extends JpaRepository<ChatMessage, Long> {

    @Query("""
        SELECT DISTINCT conv.customer
        FROM ChatConversation conv
    """)
    List<Account> findAllCustomersInConversations();

    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
}

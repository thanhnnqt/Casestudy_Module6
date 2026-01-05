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
        SELECT DISTINCT c.conversation.customer
        FROM ChatMessage c
        WHERE c.receiver.id = :adminId
           OR c.sender.id = :adminId
    """)
    List<Account> findDistinctCustomersChatWithAdmin(
            @Param("adminId") Long adminId
    );

    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
}

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

    // Đếm số tin nhắn chưa đọc từ customer gửi cho Admin
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.sender.id = :customerId AND m.receiverRole = 'ADMIN' AND m.readStatus = false")
    long countUnreadMessagesForAdmin(@Param("customerId") Long customerId);

    // Tìm tất cả tin nhắn chưa đọc từ sender gửi cho receiver
    List<ChatMessage> findBySenderIdAndReceiverIdAndReadStatusFalse(Long senderId, Long receiverId);

    // Tìm tất cả tin nhắn chưa đọc từ customer gửi cho ADMIN (bất kỳ admin nào)
    // Query này phải khớp với logic của countUnreadMessagesForAdmin
    @Query("SELECT m FROM ChatMessage m WHERE m.sender.id = :customerId AND m.receiverRole = 'ADMIN' AND m.readStatus = false")
    List<ChatMessage> findUnreadMessagesFromCustomerToAdmin(@Param("customerId") Long customerId);
}

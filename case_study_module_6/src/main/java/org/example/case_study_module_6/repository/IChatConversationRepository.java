package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    Optional<ChatConversation> findByCustomerId(Long customerAccountId);
}
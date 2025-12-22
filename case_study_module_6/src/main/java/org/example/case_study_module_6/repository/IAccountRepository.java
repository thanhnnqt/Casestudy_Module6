package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface IAccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    Optional<Account> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("""
        SELECT a FROM Account a
        WHERE a.username = :identifier
           OR a.email = :identifier
    """)
    Optional<Account> findByIdentifier(String identifier);
}

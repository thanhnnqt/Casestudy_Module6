package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IAccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);
    boolean existsByUsername(String username);
}

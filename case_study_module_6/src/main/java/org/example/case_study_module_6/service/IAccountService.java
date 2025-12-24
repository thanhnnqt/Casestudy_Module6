package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Account;

import java.util.Optional;

public interface IAccountService {
    Optional<Account> findByUsername(String username);

    Optional<Account> findByIdentifier(String identifier);

    boolean existsByUsername(String username);

    Account save(Account account);
}

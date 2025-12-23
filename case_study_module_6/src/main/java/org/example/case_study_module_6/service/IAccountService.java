package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Account;

import java.util.Optional;

public interface IAccountService {
    Account save(Account account);
    Optional<Account> findByUsername(String username);
    public boolean existsByUsername(String username);
}

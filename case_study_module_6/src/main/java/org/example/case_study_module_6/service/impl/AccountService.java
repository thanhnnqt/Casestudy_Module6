package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.service.IAccountService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService implements IAccountService {

    private final IAccountRepository accountRepository;

    public AccountService(IAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public Optional<Account> findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }


    @Override
    public Optional<Account> findByIdentifier(String identifier) {
        return accountRepository.findByIdentifier(identifier);
    }

    @Override
    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    @Override
    public Account save(Account account) {
        return accountRepository.save(account);
    }
}

package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Account;

import java.util.Optional;

public interface IAccountService {
    Account save(Account account);
    Optional<Account> findByUsername(String username);
    boolean existsByUsername(String username);
    void createCustomerProfile(Account account, org.example.case_study_module_6.dto.RegisterRequest req);
    String resolveRole(Long accountId);
    org.example.case_study_module_6.entity.Admin findAdminByAccount(Account acc);
    org.example.case_study_module_6.entity.Employee findEmployeeByAccount(Account acc);
    String getDisplayName(Long accountId);
}

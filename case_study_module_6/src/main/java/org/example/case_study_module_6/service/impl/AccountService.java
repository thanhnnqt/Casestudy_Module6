package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.*;
import org.example.case_study_module_6.repository.*;
import org.example.case_study_module_6.service.IAccountService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AccountService implements IAccountService {

    private final IAccountRepository accountRepository;
    private final ICustomerRepository customerRepository;
    private final IEmployeeRepository employeeRepository;
    private final IAdminRepository adminRepository;

    public AccountService(
            IAccountRepository accountRepository,
            ICustomerRepository customerRepository,
            IEmployeeRepository employeeRepository,
            IAdminRepository adminRepository
    ) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.adminRepository = adminRepository;
    }

    public Optional<Account> findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    public Account save(Account account) {
        return accountRepository.save(account);
    }

    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    // ================= ROLE =================
    public String resolveRole(Long accountId) {
        if (adminRepository.existsByAccountId(accountId)) return "ROLE_ADMIN";
        if (employeeRepository.existsByAccountId(accountId)) return "ROLE_EMPLOYEE";
        return "ROLE_USER";
    }

    public Admin findAdminByAccount(Account acc) {
        return adminRepository.findByAccountId(acc.getId()).orElse(null);
    }

    public Employee findEmployeeByAccount(Account acc) {
        return employeeRepository.findByAccountId(acc.getId()).orElse(null);
    }

    // ================= REGISTER =================
    public void createCustomerProfile(Account account, RegisterRequest req) {

        Customer c = new Customer();
        c.setAccount(account);
        c.setFullName(req.getFullName());
        c.setEmail(req.getEmail());
        c.setGender(req.getGender());
        c.setPhoneNumber(req.getPhoneNumber());
        c.setIdentityCard(req.getIdentityCard());
        c.setAddress(req.getAddress());
        c.setDateOfBirth(req.getDateOfBirth());
        c.setCreatedAt(LocalDateTime.now());
        customerRepository.save(c);
    }
}

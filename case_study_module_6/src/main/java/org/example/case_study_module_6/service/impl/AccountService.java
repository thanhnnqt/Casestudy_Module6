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

        if (adminRepository.existsByAccountId(accountId)) {
            return "ADMIN";
        }

        if (employeeRepository.existsByAccountId(accountId)) {
            return "EMPLOYEE";
        }

        if (customerRepository.existsByAccountId(accountId)) {
            return "CUSTOMER";
        }

        throw new RuntimeException("Account chưa được gán role");
    }

    public Admin findAdminByAccount(Account acc) {
        return adminRepository.findByAccountId(acc.getId()).orElse(null);
    }

    public Employee findEmployeeByAccount(Account acc) {
        return employeeRepository.findByAccountId(acc.getId()).orElse(null);
    }

    private String generateCustomerCode() {
        long count = customerRepository.count() + 1;
        return "KH" + String.format("%d", count);
    }

    // ================= REGISTER =================
    public void createCustomerProfile(Account account, RegisterRequest req) {

        Customer c = new Customer();
        c.setCustomerCode(generateCustomerCode());
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

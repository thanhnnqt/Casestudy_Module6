package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
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

    public Account save(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public Optional<Account> findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    // ================= ROLE RESOLVE =================

    /**
     * Suy role dựa vào bảng profile
     */
    public String resolveRole(Long accountId) {

        if (adminRepository.existsByAccountId(accountId)) {
            return "ROLE_ADMIN";
        }

        if (employeeRepository.existsByAccountId(accountId)) {
            return "ROLE_EMPLOYEE";
        }

        if (customerRepository.existsByAccountId(accountId)) {
            return "ROLE_USER";
        }
        // ✅ FIX: default role
        return "ROLE_USER";
    }

    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    // ================= REGISTER =================

    /**
     * Tạo CUSTOMER khi đăng ký
     */
    public void createCustomerProfile(Account account, RegisterRequest req) {

        Customer customer = new Customer();
        customer.setCustomerCode("KH" + System.currentTimeMillis());
        customer.setAccount(account);
        customer.setFullName(req.getFullName());
        customer.setDateOfBirth(req.getDateOfBirth());
        customer.setGender(req.getGender());
        customer.setPhoneNumber(req.getPhoneNumber());
        customer.setIdentityCard(req.getIdentityCard());
        customer.setEmail(req.getEmail());
        customer.setAddress(req.getAddress());
        customer.setCreatedAt(LocalDateTime.now());

        customerRepository.save(customer);
    }
}

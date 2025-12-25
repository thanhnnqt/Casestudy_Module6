package org.example.case_study_module_6.service.impl;

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
    public void createCustomerProfile(
            Account account,
            String fullName,
            String phone,
            String email,
            String address
    ) {
        Customer customer = new Customer();

        // 🔥 FIX 403 Ở ĐÂY
        customer.setCustomerCode("CUS_" + System.currentTimeMillis());

        customer.setAccount(account);
        customer.setFullName(fullName);
        customer.setPhoneNumber(phone);
        customer.setEmail(email);
        customer.setAddress(address);
        customer.setCreatedAt(LocalDateTime.now());

        customerRepository.save(customer);
    }
}

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

    @Override
    public Optional<Account> findByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    @Override
    public Account save(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    // ================= ROLE =================
    @Override
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

    @Override
    public Admin findAdminByAccount(Account acc) {
        return adminRepository.findByAccountId(acc.getId()).orElse(null);
    }

    @Override
    public Employee findEmployeeByAccount(Account acc) {
        return employeeRepository.findByAccountId(acc.getId()).orElse(null);
    }

    private String generateCustomerCode() {
        // Lấy số lượng bản ghi hiện tại + 1, và format thành KH0001
        long count = customerRepository.count();
        String code;
        int attempts = 0;
        do {
            count++;
            code = String.format("KH%04d", count);
            attempts++;
        } while (customerRepository.existsByCustomerCode(code) && attempts < 100);
        
        return code;
    }

    // ================= REGISTER =================
    @Override
    public void createCustomerProfile(Account account, RegisterRequest req) {
        System.out.println(">>> Starting createCustomerProfile for account: " + account.getUsername());
        try {
            Customer c = new Customer();
            String code = generateCustomerCode();
            System.out.println(">>> Generated CustomerCode: " + code);
            
            c.setCustomerCode(code);
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
            System.out.println(">>> Successfully saved Customer profile");
        } catch (Exception e) {
            System.err.println(">>> ERROR in createCustomerProfile: " + e.getMessage());
            e.printStackTrace();
            throw e; // Throw lại để Rollback transaction ở Controller
        }
    }

    @Override
    public String getDisplayName(Long accountId) {
        if (adminRepository.existsByAccountId(accountId)) {
            return adminRepository.findByAccountId(accountId)
                    .map(Admin::getFullName)
                    .orElse("Admin");
        }
        if (employeeRepository.existsByAccountId(accountId)) {
            return employeeRepository.findByAccountId(accountId)
                    .map(Employee::getFullName)
                    .orElse("Employee");
        }
        if (customerRepository.existsByAccountId(accountId)) {
            return customerRepository.findByAccountId(accountId)
                    .map(Customer::getFullName)
                    .orElse("Customer");
        }
        return accountRepository.findById(accountId)
                .map(Account::getUsername)
                .orElse("Unknown");
    }
}

package org.example.case_study_module_6.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.repository.ICustomerRepository;
import org.example.case_study_module_6.service.ICustomerService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService implements ICustomerService {
    private final ICustomerRepository customerRepository;
    private final IAccountRepository accountRepository;
//    private final PasswordEncoder passwordEncoder;

    @Override
    public Customer registerCustomer(RegisterRequest req) {

        if (accountRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username đã tồn tại");
        }

        // ===== ACCOUNT =====
        Account account = new Account();
        account.setUsername(req.getUsername());
//        account.setPassword(passwordEncoder.encode(req.getPassword()));

        accountRepository.save(account);

        // ===== CUSTOMER =====
        Customer customer = new Customer();
        customer.setCustomerCode("CUS-" + UUID.randomUUID().toString().substring(0, 8));
        customer.setFullName(req.getFullName());
        customer.setDateOfBirth(req.getDateOfBirth());
        customer.setGender(Customer.Gender.valueOf(req.getGender()));
        customer.setPhoneNumber(req.getPhoneNumber());
        customer.setIdentityCard(req.getIdentityCard());
        customer.setAddress(req.getAddress());
        customer.setCreatedAt(LocalDateTime.now());
        customer.setAccount(account);

        return customerRepository.save(customer);
    }
}

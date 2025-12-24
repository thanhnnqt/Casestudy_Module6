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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService implements ICustomerService {
    private final ICustomerRepository customerRepository;
    private final IAccountRepository accountRepository;
//    private final PasswordEncoder passwordEncoder;


    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public List<Customer> searchCustomers(String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return customerRepository.searchCustomer(keyword);
        }
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Customer addCustomer(Customer customer) {
        if (customerRepository.existsByCustomerCode(customer.getCustomerCode())) {
            throw new RuntimeException("Mã khách hàng " + customer.getCustomerCode() + " đã tồn tại!");
        }

        if (customerRepository.existsByPhoneNumber(customer.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại " + customer.getPhoneNumber() + " đã tồn tại!");
        }


        if (customer.getCreatedAt() == null) {
            customer.setCreatedAt(LocalDateTime.now());
        }


        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));

        // Cập nhật thông tin (trừ mã KH và ngày tạo)
        existingCustomer.setFullName(customerDetails.getFullName());
        existingCustomer.setDateOfBirth(customerDetails.getDateOfBirth());
        existingCustomer.setGender(customerDetails.getGender());
        existingCustomer.setPhoneNumber(customerDetails.getPhoneNumber());
        existingCustomer.setIdentityCard(customerDetails.getIdentityCard());
        existingCustomer.setAddress(customerDetails.getAddress());


        return customerRepository.save(existingCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Khách hàng không tồn tại!");
        }
        customerRepository.deleteById(id);
    }


    @Override
    public Customer registerCustomer(RegisterRequest req) {

//        if (accountRepository.existsByUsername(req.getUsername())) {
//            throw new RuntimeException("Username đã tồn tại");
//        }
//
//        if (accountRepository.existsByEmail(req.getEmail())) {
//            throw new RuntimeException("Email đã tồn tại");
//        }

        // ===== ACCOUNT =====
        Account account = new Account();
        account.setUsername(req.getUsername());
//        account.setEmail(req.getEmail());
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

    @Override
    public boolean existsByAccountId(Long accountId) {
        return customerRepository.existsByAccountId(accountId);
    }

    public Optional<Customer> findByAccountId(Long accountId) {
        return customerRepository.findByAccountId(accountId);
    }

    @Override
    public Customer findByAccount(Account account) {
        return customerRepository.findByAccount(account);
    }
}



package org.example.case_study_module_6.service;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import org.example.case_study_module_6.dto.CustomerUpdateRequest;
import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ICustomerService {
    Customer registerCustomer(RegisterRequest request);

    List<Customer> getAllCustomers();

    // Sửa: Thêm Pageable và trả về Page
    Page<Customer> searchCustomers(String name, String phone, String identity, Pageable pageable);

    Optional<Customer> getCustomerById(Long id);

    Customer addCustomer(Customer customer);

    Customer updateCustomer(Long id, Customer customer);

    void deleteCustomer(Long id);

    boolean existsByAccountId(Long accountId);
    Optional<Customer> findByAccountId(Long accountId);
    Customer findByAccount(Account account);
    Customer findByEmail(String email);

    void save(Customer customer);
    boolean existsByPhoneNumber(@Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại không hợp lệ") String phoneNumber);

    boolean existsByIdentityCard(@Pattern(regexp = "^(\\d{9}|\\d{12})$", message = "CCCD không hợp lệ") String identityCard);

    boolean existsByEmail(@Email(message = "Email không hợp lệ") String email);

    void updateProfileById(Long customerId, CustomerUpdateRequest req);
}

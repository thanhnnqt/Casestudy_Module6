package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;

import java.util.List;
import java.util.Optional;

public interface ICustomerService {
    Customer registerCustomer(RegisterRequest request);

    List<Customer> getAllCustomers();

    List<Customer> searchCustomers(String keyword);

    Optional<Customer> getCustomerById(Long id);

    Customer addCustomer(Customer customer);

    Customer updateCustomer(Long id, Customer customer);

    void deleteCustomer(Long id);

    boolean existsByAccountId(Long accountId);
    Optional<Customer> findByAccountId(Long accountId);
    Customer findByAccount(Account account);
    Customer findByEmail(String email);

    void save(Customer customer);
}

package org.example.case_study_module_6.service;

import org.example.case_study_module_6.dto.RegisterRequest;
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
}
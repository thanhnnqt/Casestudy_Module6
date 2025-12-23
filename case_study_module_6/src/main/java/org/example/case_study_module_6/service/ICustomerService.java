package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Customer;

import java.util.Optional;

public interface ICustomerService {
    boolean existsByAccountId(Long accountId);
    Optional<Customer> findByAccountId(Long accountId);
}

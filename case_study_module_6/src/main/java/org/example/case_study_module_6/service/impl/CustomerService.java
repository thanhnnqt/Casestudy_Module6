package org.example.case_study_module_6.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.repository.ICustomerRepository;
import org.example.case_study_module_6.service.ICustomerService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService implements ICustomerService {
    private final ICustomerRepository customerRepository;

    @Override
    public boolean existsByAccountId(Long accountId) {
        return customerRepository.existsByAccountId(accountId);
    }

    @Override
    public Optional<Customer> findByAccountId(Long accountId) {
        return customerRepository.findByAccountId(accountId);
    }

}

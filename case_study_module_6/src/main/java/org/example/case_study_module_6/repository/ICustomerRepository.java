package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByAccountId(Long accountId);
    Optional<Customer> findByAccountId(Long accountId);
    Customer findByAccount(Account account);
}

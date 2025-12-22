package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByIdentityCard(String identityCard);
}

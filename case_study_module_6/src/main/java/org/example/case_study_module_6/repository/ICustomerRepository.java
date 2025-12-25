package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ICustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByIdentityCard(String identityCard);

    boolean existsByCustomerCode(String customerCode);

    @Query("SELECT c FROM Customer c WHERE " +
            "c.customerCode LIKE %?1% OR " +
            "c.fullName LIKE %?1% OR " +
            "c.phoneNumber LIKE %?1% OR " +
            "c.identityCard LIKE %?1%")
    List<Customer> searchCustomer(String keyword);
    boolean existsByAccountId(Long accountId);

    Optional<Customer> findByAccountId(Long accountId);

    Customer findByAccount(Account account);
    Customer findByEmail(String email);
}


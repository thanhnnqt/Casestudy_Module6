package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByPhoneNumber(String phoneNumber);
    Customer findByAccount(Account account);
    Customer findTopByOrderByIdDesc();

    // Hàm này bạn đã có nhưng chưa dùng bên Service
    boolean existsByIdentityCard(String identityCard);

    boolean existsByCustomerCode(String customerCode);
    boolean existsByAccountId(Long accountId);
    Customer findByEmail(String email);
    // Thêm hàm kiểm tra trùng Email
    boolean existsByEmail(String email);

    // Query tìm kiếm giữ nguyên
    @Query("SELECT c FROM Customer c WHERE " +
            "(:name IS NULL OR :name = '' OR c.fullName LIKE %:name%) AND " +
            "(:phone IS NULL OR :phone = '' OR c.phoneNumber LIKE %:phone%) AND " +
            "(:identity IS NULL OR :identity = '' OR c.identityCard LIKE %:identity%)")
    Page<Customer> searchCustomers(
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("identity") String identity,
            Pageable pageable
    );

    Optional<Customer> findByAccountId(Long accountId);
}
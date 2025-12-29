package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


public interface IEmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByFullNameContainingIgnoreCase(String fullName);

    boolean existsByAccountId(Long accountId);

    @Query(
            value = """
                    SELECT * FROM employees e
                    WHERE (:fullName IS NULL OR LOWER(e.full_name) LIKE LOWER(CONCAT('%', :fullName, '%')))
                    AND (:phoneNumber IS NULL OR e.phone_number LIKE CONCAT('%', :phoneNumber, '%'))
                    """,
            countQuery = """
                    SELECT COUNT(*) FROM employees e
                    WHERE (:fullName IS NULL OR LOWER(e.full_name) LIKE LOWER(CONCAT('%', :fullName, '%')))
                    AND (:phoneNumber IS NULL OR e.phone_number LIKE CONCAT('%', :phoneNumber, '%'))
                    """,
            nativeQuery = true
    )
    Page<Employee> searchEmployeesNative(
            @Param("fullName") String fullName,
            @Param("phoneNumber") String phoneNumber,
            Pageable pageable
    );

    boolean existsByIdentificationId(String identificationId);

    boolean existsByImgHash(String imgHash);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phone);

    Optional<Employee> findByImgHash(String hash);
}
package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
}
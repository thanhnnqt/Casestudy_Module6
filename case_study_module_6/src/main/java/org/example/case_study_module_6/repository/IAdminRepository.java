package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface IAdminRepository extends JpaRepository<Admin, Long> {

    @Query("""
        SELECT a FROM Admin a
        WHERE (:fullName IS NULL OR a.fullName LIKE %:fullName%)
    """)
    Page<Admin> searchAdmins(String fullName, Pageable pageable);

    boolean existsByAccountId(Long accountId);

    Optional<Admin> findByAccountId(Long accountId);
}

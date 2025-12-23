package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByAccountId(Long accountId);
}

package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Admin;
import org.springframework.data.domain.Page;

public interface IAdminService {
    Page<Admin> searchAdmins(String fullName, int page, int size);
    Admin findById(Long id);
    Admin save(Admin admin);
    void delete(Long id);
}

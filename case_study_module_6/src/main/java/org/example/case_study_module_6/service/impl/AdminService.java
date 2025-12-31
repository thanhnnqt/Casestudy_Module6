package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.entity.Admin;
import org.example.case_study_module_6.repository.IAdminRepository;
import org.example.case_study_module_6.service.IAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AdminService implements IAdminService {

    private final IAdminRepository adminRepository;

    public AdminService(IAdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public Page<Admin> searchAdmins(String fullName, int page, int size) {
        return adminRepository.searchAdmins(
                fullName == null ? "" : fullName,
                PageRequest.of(page, size)
        );
    }

    @Override
    public Admin findById(Long id) {
        return adminRepository.findById(id).orElseThrow();
    }

    @Override
    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public void delete(Long id) {
        adminRepository.deleteById(id);
    }
}

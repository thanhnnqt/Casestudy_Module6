package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.repository.IAdminRepository;
import org.example.case_study_module_6.service.IAdminService;
import org.springframework.stereotype.Service;

@Service
public class AdminService implements IAdminService {

    private final IAdminRepository adminRepository;
    public AdminService (IAdminRepository adminRepository){
        this.adminRepository = adminRepository;
    }

    @Override
    public boolean existsByAccountId(Long accountId) {
        return adminRepository.existsByAccountId(accountId);
    }
}

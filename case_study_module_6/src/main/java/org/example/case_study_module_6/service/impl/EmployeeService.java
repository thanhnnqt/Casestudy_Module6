package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.repository.IEmployeeRepository;
import org.example.case_study_module_6.service.IEmployeeService;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService implements IEmployeeService {

    private final IEmployeeRepository employeeRepository;
    public EmployeeService (IEmployeeRepository employeeRepository){
        this.employeeRepository = employeeRepository;
    }

    @Override
    public boolean existsByAccountId(Long accountId) {
        return employeeRepository.existsByAccountId(accountId);
    }
}

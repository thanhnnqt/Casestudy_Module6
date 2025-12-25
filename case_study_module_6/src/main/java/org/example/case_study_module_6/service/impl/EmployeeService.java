package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.entity.Employee;
import org.example.case_study_module_6.repository.IEmployeeRepository;
import org.example.case_study_module_6.service.IEmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService implements IEmployeeService {
    final IEmployeeRepository employeeRepository;

    public EmployeeService(IEmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    @Override
    public void delete(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public Employee findById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public boolean save(Employee employee) {
        return employeeRepository.save(employee) != null;
    }

    @Override
    public boolean existsByAccountId(Long accountId) {
        return employeeRepository.existsByAccountId(accountId);
    }
}

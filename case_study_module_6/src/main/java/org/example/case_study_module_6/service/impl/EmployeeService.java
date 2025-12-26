package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.entity.Employee;
import org.example.case_study_module_6.repository.IEmployeeRepository;
import org.example.case_study_module_6.service.IEmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @Override
    public Page<Employee> searchEmployees(String fullName, String phoneNumber, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return employeeRepository.searchEmployeesNative(
                (fullName == null || fullName.isBlank()) ? null : fullName,
                (phoneNumber == null || phoneNumber.isBlank()) ? null : phoneNumber,
                pageable
        );
    }

    @Override
    public boolean existsByIdentificationId(String id) {
        return employeeRepository.existsByIdentificationId(id);
    }

    @Override
    public boolean existsByImgHash(String hash) {
        return employeeRepository.existsByImgHash(hash);
    }

    @Override
    public boolean existsByEmail(String email) {
        return employeeRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhoneNumber(String phone) {
        return employeeRepository.existsByPhoneNumber(phone);
    }

    @Override
    public boolean existsByImgHashAndIdNot(String hash, Long id) {
        return employeeRepository.existsByImgHashAndIdNot(hash, id);
    }
}

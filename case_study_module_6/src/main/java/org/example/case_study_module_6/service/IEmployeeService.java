package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Employee;
import org.springframework.data.domain.Page;


import java.util.List;

public interface IEmployeeService {
    List<Employee> findAll();

    void delete(Long id);

    Employee findById(Long id);

    boolean save(Employee employee);

    boolean existsByAccountId(Long accountId);

    Page<Employee> searchEmployees(
            String fullName,
            String phoneNumber,
            int page,
            int size
    );

    public boolean existsByIdentificationId(String id);

    boolean existsByImgHash(String hash);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phone);

    boolean existsByImgHashAndIdNot(String hash, Long id);
}



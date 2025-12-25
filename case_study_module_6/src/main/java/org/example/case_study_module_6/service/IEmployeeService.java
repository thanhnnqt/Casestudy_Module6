package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.Employee;


import java.util.List;

public interface IEmployeeService {
    List<Employee> findAll();

    void delete(Long id);

    Employee findById(Long id);

    boolean save(Employee employee);

    List<Employee> search(String field, String keyword);
}



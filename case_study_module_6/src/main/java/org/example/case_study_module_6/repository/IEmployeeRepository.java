package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IEmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByEmployeeCodeContainingIgnoreCase(String employeeCode);

    List<Employee> findByFullNameContainingIgnoreCase(String fullName);
}

import org.example.case_study_module_6.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByAccountId(Long accountId);
package org.example.case_study_module_6.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.case_study_module_6.dto.EmployeeDTO;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Employee;
import org.example.case_study_module_6.service.IAccountService;
import org.example.case_study_module_6.service.IEmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RestController
@CrossOrigin("*")
@RequestMapping("/v1/api/employees")
public class EmployeeController {
    final IEmployeeService employeeService;
    final IAccountService accountService;

    public EmployeeController(IEmployeeService employeeService, IAccountService accountService) {
        this.employeeService = employeeService;
        this.accountService = accountService;
    }

    @Operation(summary = "Lấy danh sách toàn bộ nhân viên")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công!")
    })
    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Employee> employeeList = employeeService.findAll();
        return new ResponseEntity<>(employeeList, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return new ResponseEntity<>(employeeService.findById(id), HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> edit(@RequestBody Employee employee) {
        System.out.println(employee);
        boolean isEdited = employeeService.save(employee);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EmployeeDTO employeeDTO) {
        Account account  = new Account();
        account.setId(32L);
        Employee employee = new Employee();
        employee.setEmployeeCode(employeeDTO.getEmployeeCode());
        employee.setAddress(employeeDTO.getAddress());
        employee.setFullName(employeeDTO.getFullName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setDob(employeeDTO.getDOB());
        employee.setGender(Employee.Gender.valueOf(employeeDTO.getGender()));
        employee.setPhoneNumber(employeeDTO.getPhoneNumber());
        employee.setAccountId(account.getId());
        System.out.println(employeeDTO.getDOB());
        employeeService.save(employee);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}

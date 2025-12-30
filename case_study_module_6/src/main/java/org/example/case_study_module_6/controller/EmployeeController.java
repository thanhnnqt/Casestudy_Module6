package org.example.case_study_module_6.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.case_study_module_6.dto.EmployeeDTO;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Employee;
import org.example.case_study_module_6.entity.Provider;
import org.example.case_study_module_6.service.IAccountService;
import org.example.case_study_module_6.service.IEmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.example.case_study_module_6.service.impl.JwtService;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RestController
@CrossOrigin("*")
@RequestMapping("/v1/api/employees")
public class EmployeeController {
    final IEmployeeService employeeService;
    final IAccountService accountService;
    private final PasswordEncoder passwordEncoder;
    final JwtService jwtService;



    public EmployeeController(IEmployeeService employeeService, IAccountService accountService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.employeeService = employeeService;
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Lấy danh sách toàn bộ nhân viên")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công!")
    })
    @GetMapping
    public ResponseEntity<Page<Employee>> searchEmployees(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size
    ) {
        Page<Employee> data =
                employeeService.searchEmployees(fullName, phoneNumber, page, size);

        return ResponseEntity.ok(data);
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
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
        if (employeeService.existsByImgHashAndIdNot(employee.getImgHash(), id)) {
            return ResponseEntity.badRequest().body("Ảnh đã tồn tại!");
        }

        employeeService.save(employee);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody EmployeeDTO employeeDTO) {
        Account account = new Account();
        account.setUsername(employeeDTO.getUsername());
        account.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        account.setCreatedAt(employeeDTO.getCreateAt());
        account.setProvider(Provider.valueOf(employeeDTO.getProvider()));
        Account accountCreated = accountService.save(account);
        Employee employee = new Employee();
        employee.setAccount(accountCreated);
        employee.setDob(employeeDTO.getDOB());
        employee.setEmail(employeeDTO.getEmail());
        employee.setGender(Employee.Gender.valueOf(employeeDTO.getGender()));
        employee.setFullName(employeeDTO.getFullName());
        employee.setAddress(employeeDTO.getAddress());
        employee.setPhoneNumber(employeeDTO.getPhoneNumber());
        employee.setIdentificationId(employeeDTO.getIdentificationId());
        employee.setImgHash(employeeDTO.getImgHash());
        employee.setImgURL(employeeDTO.getImgURL());
        Employee employeeCreated = employeeService.save(employee);
        String token = authHeader.substring(7);
        var claims = jwtService.extractClaims(token);

        Long accountId = claims.get("accountId", Long.class);

//        employee.setAccountId(accountId);
        return new ResponseEntity<>(employeeCreated, HttpStatus.CREATED);
    }

    @GetMapping("/check-identification")
    public boolean checkIdentification(@RequestParam String value) {
        return employeeService.existsByIdentificationId(value);
    }

    @GetMapping("/check-image-hash")
    public ResponseEntity<Boolean> checkImageHashExists(@RequestParam String hash) {
        boolean exists = employeeService.existsByImgHash(hash);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String value) {
        return ResponseEntity.ok(employeeService.existsByEmail(value));
    }

    @GetMapping("/check-phone")
    public ResponseEntity<Boolean> checkPhone(@RequestParam String value) {
        return ResponseEntity.ok(employeeService.existsByPhoneNumber(value));
    }

    @GetMapping("/check-image-hash-except")
    public ResponseEntity<Boolean> checkImageHashExcept(
            @RequestParam String hash,
            @RequestParam Long id) {
        boolean exists = employeeService.existsByImgHashAndIdNot(hash, id);
        System.out.println(exists);
        return ResponseEntity.ok(exists);
    }

    @PatchMapping("/{id}/update-image")
    public ResponseEntity<?> updateImage(
            @PathVariable Long id,
            @RequestParam String imageUrl,
            @RequestParam String imageHash
    ) {
        Employee emp = employeeService.findById(id);
        emp.setImgURL(imageUrl);
        emp.setImgHash(imageHash);
        employeeService.save(emp);
        return ResponseEntity.ok("Updated");
    }

}

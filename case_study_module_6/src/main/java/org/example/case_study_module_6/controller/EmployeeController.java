package org.example.case_study_module_6.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.case_study_module_6.dto.EmployeeDTO;
import org.example.case_study_module_6.dto.RevenueDTO;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Admin;
import org.example.case_study_module_6.entity.Employee;
import org.example.case_study_module_6.entity.Provider;
import org.example.case_study_module_6.service.IAccountService;
import org.example.case_study_module_6.service.IAdminService;
import org.example.case_study_module_6.service.IEmployeeService;
import org.example.case_study_module_6.service.impl.AccountService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.example.case_study_module_6.service.impl.JwtService;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@Controller
@RestController
@CrossOrigin("*")
@RequestMapping("/v1/api/employees")
public class EmployeeController {
    private final IEmployeeService employeeService;
    private final IAccountService accountService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final IAdminService adminService;

    public EmployeeController(IEmployeeService employeeService, IAccountService accountService, PasswordEncoder passwordEncoder, JwtService jwtService, IAdminService adminService) {
        this.employeeService = employeeService;
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.adminService = adminService;
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

        if (accountService.existsByUsername(employeeDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Tài khoản đã tồn tại");
        }

        Account account = new Account();
        account.setUsername(employeeDTO.getUsername());
        account.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        account.setCreatedAt(employeeDTO.getCreateAt());
        account.setProvider(Provider.valueOf(employeeDTO.getProvider()));

        Account accountCreated = accountService.save(account);

        String role = employeeDTO.getTargetRole();

        if ("ADMIN".equalsIgnoreCase(role)) {
            Admin admin = new Admin();
            admin.setAccount(accountCreated);
            admin.setFullName(employeeDTO.getFullName());
            admin.setEmail(employeeDTO.getEmail());
            admin.setCreatedAt(employeeDTO.getCreateAt());
            admin.setPhoneNumber(employeeDTO.getPhoneNumber());

            Admin adminCreated = adminService.save(admin);
            adminCreated.setAdminCode("AD" + adminCreated.getId());
            adminService.save(adminCreated);

            return ResponseEntity.status(HttpStatus.CREATED).body(adminCreated);
        } else {
            Employee employee = new Employee();
            employee.setAccount(accountCreated);
            employee.setFullName(employeeDTO.getFullName());
            employee.setEmail(employeeDTO.getEmail());
            employee.setPhoneNumber(employeeDTO.getPhoneNumber());
            employee.setIdentificationId(employeeDTO.getIdentificationId());
            employee.setDob(employeeDTO.getDOB());
            employee.setAddress(employeeDTO.getAddress());
            employee.setGender(Employee.Gender.valueOf(employeeDTO.getGender()));
            employee.setImgHash(employeeDTO.getImgHash());
            employee.setImgURL(employeeDTO.getImgURL());

            Employee employeeCreated = employeeService.save(employee);
            return ResponseEntity.status(HttpStatus.CREATED).body(employeeCreated);
        }
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

    @GetMapping("/exists-username")
    public ResponseEntity<Boolean> existsUsername(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String username
    ) {
        boolean exists = accountService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

}

package org.example.case_study_module_6.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.case_study_module_6.entity.Admin;
import org.example.case_study_module_6.service.IAdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/v1/api/admins")
public class AdminController {

    private final IAdminService adminService;

    public AdminController(IAdminService adminService) {
        this.adminService = adminService;
    }

    // ================= GET LIST =================
    @Operation(summary = "Lấy danh sách Admin")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách admin thành công")
    })
    @GetMapping
    public ResponseEntity<Page<Admin>> getAll(
            @RequestParam(required = false) String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Page<Admin> data = adminService.searchAdmins(fullName, page, size);
        return ResponseEntity.ok(data);
    }

    // ================= GET BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findById(id));
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Admin admin) {
        adminService.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Admin admin
    ) {
        admin.setId(id);
        adminService.save(admin);
        return ResponseEntity.noContent().build();
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package org.example.case_study_module_6.controller;


import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    @Autowired
    private ICustomerService customerService; // Sử dụng Interface ở đây

    // GET: Tìm kiếm và Lấy danh sách
    @GetMapping
    public ResponseEntity<List<Customer>> getCustomers(@RequestParam(required = false) String keyword) {
        List<Customer> customers = customerService.searchCustomers(keyword);
        return ResponseEntity.ok(customers);
    }

    // GET: Chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: Thêm mới
    @PostMapping
    public ResponseEntity<?> addCustomer(@RequestBody Customer customer) {
        try {
            Customer newCustomer = customerService.addCustomer(customer);
            return ResponseEntity.ok(newCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT: Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customer);
            return ResponseEntity.ok(updatedCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE: Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok("Xóa thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

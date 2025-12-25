package org.example.case_study_module_6.controller;

import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    @Autowired
    private ICustomerService customerService;

    // GET: Tìm kiếm đa năng
    // URL ví dụ: /api/customers?name=Anh&phone=098&identity=123
    @GetMapping
    public ResponseEntity<Page<Customer>> getCustomers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String identity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size // Mặc định 10 khách/trang
    ) {
        // Sắp xếp mới nhất lên đầu (giả sử theo ID giảm dần)
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Customer> customers = customerService.searchCustomers(name, phone, identity, pageable);
        return ResponseEntity.ok(customers);
    }

    // ... (Các hàm khác GET id, POST, PUT, DELETE giữ nguyên)
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerService.getCustomerById(id);
        return customer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addCustomer(@RequestBody Customer customer) {
        try {
            Customer newCustomer = customerService.addCustomer(customer);
            return ResponseEntity.ok(newCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customer);
            return ResponseEntity.ok(updatedCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

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
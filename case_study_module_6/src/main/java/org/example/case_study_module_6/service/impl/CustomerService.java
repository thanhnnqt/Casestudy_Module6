package org.example.case_study_module_6.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.repository.ICustomerRepository;
import org.example.case_study_module_6.service.ICustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService implements ICustomerService {
    private final ICustomerRepository customerRepository;
    private final IAccountRepository accountRepository;
//    private final PasswordEncoder passwordEncoder;


    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Page<Customer> searchCustomers(String name, String phone, String identity, Pageable pageable) {
        return customerRepository.searchCustomers(name, phone, identity, pageable);
    }

    @Override
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Customer addCustomer(Customer customer) {
        // 1. Kiểm tra Mã khách hàng
        customer.setCustomerCode(generateNextCustomerCode());

        // 2. Kiểm tra Số điện thoại
        if (customerRepository.existsByPhoneNumber(customer.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại " + customer.getPhoneNumber() + " đã tồn tại!");
        }

        // 3. Kiểm tra Email (Mới thêm)
        if (customer.getEmail() != null && !customer.getEmail().isEmpty()) {
            if (customerRepository.existsByEmail(customer.getEmail())) {
                throw new RuntimeException("Email " + customer.getEmail() + " đã tồn tại!");
            }
        }

        // 4. Kiểm tra CCCD (Đây là phần bạn bị thiếu trước đó)
        if (customerRepository.existsByIdentityCard(customer.getIdentityCard())) {
            throw new RuntimeException("CCCD/CMND " + customer.getIdentityCard() + " đã tồn tại!");
        }

        if (customer.getCreatedAt() == null) {
            customer.setCreatedAt(LocalDateTime.now());
        }


        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));

        // Cập nhật thông tin
        existingCustomer.setFullName(customerDetails.getFullName());
        existingCustomer.setDateOfBirth(customerDetails.getDateOfBirth());
        existingCustomer.setGender(customerDetails.getGender());
        existingCustomer.setPhoneNumber(customerDetails.getPhoneNumber());
        existingCustomer.setIdentityCard(customerDetails.getIdentityCard());
        existingCustomer.setAddress(customerDetails.getAddress());

        // Cập nhật Email
        existingCustomer.setEmail(customerDetails.getEmail());

        // Lưu ý: Khi update, nếu muốn kiểm tra trùng lặp chặt chẽ (ví dụ đổi SĐT sang số của người khác),
        // bạn cần viết thêm logic check "trùng nhưng không phải chính mình".
        // Ở mức cơ bản thì repository.save() sẽ tự cập nhật.

        return customerRepository.save(existingCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Khách hàng không tồn tại!");
        }
        customerRepository.deleteById(id);
    }

    @Override
    public Customer registerCustomer(RegisterRequest req) {
        // (Giữ nguyên logic cũ, có thể thêm set Email nếu trong RegisterRequest có)
        // ===== ACCOUNT =====
        Account account = new Account();
        account.setUsername(req.getUsername());
        accountRepository.save(account);

        // ===== CUSTOMER =====
        Customer customer = new Customer();
        customer.setCustomerCode("CUS-" + UUID.randomUUID().toString().substring(0, 8));
        customer.setFullName(req.getFullName());
        customer.setDateOfBirth(req.getDateOfBirth());
        customer.setGender(req.getGender());
        customer.setPhoneNumber(req.getPhoneNumber());
        customer.setIdentityCard(req.getIdentityCard());
        customer.setAddress(req.getAddress());
        // customer.setEmail(req.getEmail()); // Nếu RegisterRequest có email thì bỏ comment dòng này
        customer.setCreatedAt(LocalDateTime.now());
        customer.setAccount(account);

        return customerRepository.save(customer);
    }

    // --- LOGIC SINH MÃ TỰ ĐỘNG ---
    private String generateNextCustomerCode() {
        // Lấy khách hàng cuối cùng
        Customer lastCustomer = customerRepository.findTopByOrderByIdDesc();

        if (lastCustomer == null) {
            return "KH1"; // Nếu chưa có ai, bắt đầu từ KH1
        }

        String lastCode = lastCustomer.getCustomerCode();

        // Giả sử mã luôn là "KH" + số. Ví dụ: KH1, KH10...
        try {
            // Cắt bỏ chữ "KH", lấy phần số
            String numberPart = lastCode.substring(2);
            int nextNumber = Integer.parseInt(numberPart) + 1;
            return "KH" + nextNumber;
        } catch (NumberFormatException | StringIndexOutOfBoundsException e) {
            // Nếu mã cũ không đúng định dạng (VD: CUS-xyz), thì reset về KH + (ID + 1) cho an toàn
            return "KH" + (lastCustomer.getId() + 1);
        }
    }
    @Override
    public Customer findByAccount(Account account) {
        return customerRepository.findByAccount(account);
    }

    @Override
    public Customer findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    @Override
    public void save(Customer customer) {
        customerRepository.save(customer);
    }

    @Override
    public boolean existsByAccountId(Long accountId) {
        return customerRepository.existsByAccountId(accountId);
    }

    @Override
    public Optional<Customer> findByAccountId(Long accountId) {
        return customerRepository.findByAccountId(accountId);
    }

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        return customerRepository.existsByPhoneNumber(phoneNumber);
    }

    @Override
    public boolean existsByIdentityCard(String identityCard) {
        return customerRepository.existsByIdentityCard(identityCard);
    }


}



package org.example.case_study_module_6.controller;

import jakarta.transaction.Transactional;
import org.example.case_study_module_6.dto.GoogleLoginRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.service.impl.AccountService;
import org.example.case_study_module_6.service.impl.CustomerService;
import org.example.case_study_module_6.service.impl.GoogleTokenVerifierService;
import org.example.case_study_module_6.service.impl.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtService jwtService;
    private final AccountService accountService;
    private final PasswordEncoder passwordEncoder;
    private final GoogleTokenVerifierService googleVerifier;
    private final CustomerService customerService;

    public AuthController(
            JwtService jwtService,
            AccountService accountService,
            PasswordEncoder passwordEncoder,
            GoogleTokenVerifierService googleVerifier,
            CustomerService customerService
    ) {
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
        this.googleVerifier = googleVerifier;
        this.customerService = customerService;
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

        String identifier = req.get("identifier");
        if (identifier == null) {
            identifier = req.get("username");
        }
        String password = req.get("password").trim();

        Account account = accountService.findByUsername(identifier)
                .orElse(null);

        if (account == null) {
            return ResponseEntity.status(401).body("Tài khoản không tồn tại");
        }

        if (!Boolean.TRUE.equals(account.getEnabled())) {
            return ResponseEntity.status(403).body("Tài khoản đã bị khóa");
        }

        if (!passwordEncoder.matches(password, account.getPassword())) {
            return ResponseEntity.status(401).body("Sai mật khẩu");
        }

        String role = accountService.resolveRole(account.getId());
        Customer customer = customerService.findByAccount(account);

        String token = jwtService.generateToken(
                account.getUsername(),
                "CUSTOMER",
                customer.getId(),
                customer.getFullName()
        );

        return ResponseEntity.ok(Map.of("token", token));
    }

    // ================= REGISTER =================

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {

        String username = req.get("username");
        String rawPassword = req.get("password");

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body("Username không hợp lệ");
        }

        if (rawPassword == null || rawPassword.isBlank()) {
            return ResponseEntity.badRequest().body("Mật khẩu không hợp lệ");
        }

        if (accountService.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Username đã tồn tại");
        }

        Account account = new Account();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(rawPassword));
        account.setEnabled(true);

        Account saved = accountService.save(account);

        accountService.createCustomerProfile(
                saved,
                req.get("fullName"),
                req.get("phoneNumber"),
                req.get("email"),
                req.get("address")
        );

        return ResponseEntity.ok("Đăng ký thành công");
    }

    // ================= ME =================

    @GetMapping("/me")
    public ResponseEntity<?> me(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        var claims = jwtService.extractClaims(token);

        return ResponseEntity.ok(
                Map.of(
                        "username", claims.getSubject(),
                        "role", claims.get("role")
                )
        );
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest req) {

        var payload = googleVerifier.verify(req.getCredential());

        String email = payload.getEmail();

        // 1. Tìm hoặc tạo account
        Account account = accountService.findByUsername(email)
                .orElseGet(() -> {
                    Account acc = new Account();
                    acc.setUsername(email);
                    acc.setPassword("GOOGLE");
                    acc.setEnabled(true);

                    Account saved = accountService.save(acc);

                    // 👉 CHỈ DÙNG NAME GOOGLE KHI TẠO CUSTOMER LẦN ĐẦU
                    accountService.createCustomerProfile(
                            saved,
                            (String) payload.get("name"), // chỉ lần đầu
                            null,
                            email,
                            null
                    );

                    return saved;
                });

        // 2. ⚠️ LUÔN LOAD CUSTOMER TỪ DB
        Customer customer = customerService.findByAccount(account);

        // 3. JWT LẤY FULLNAME TỪ DB
        String token = jwtService.generateToken(
                account.getUsername(),
                "CUSTOMER",
                customer.getId(),
                customer.getFullName()   // ✅ DB
        );

        return ResponseEntity.ok(Map.of("token", token));
    }

}

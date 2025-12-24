package org.example.case_study_module_6.controller;

import jakarta.transaction.Transactional;
import org.example.case_study_module_6.dto.GoogleLoginRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.entity.Provider;
import org.example.case_study_module_6.service.impl.*;
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
    private final CustomerService customerService;
    private final PasswordEncoder passwordEncoder;
    private final GoogleTokenVerifierService googleVerifier;

    public AuthController(
            JwtService jwtService,
            AccountService accountService,
            CustomerService customerService,
            PasswordEncoder passwordEncoder,
            GoogleTokenVerifierService googleVerifier
    ) {
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
        this.googleVerifier = googleVerifier;
    }

    // ================= LOGIN LOCAL =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

        String username = req.get("username");
        String password = req.get("password");

        Account account = accountService.findByUsername(username).orElse(null);
        if (account == null) {
            return ResponseEntity.status(401).body("Account not found");
        }

        if (!account.getEnabled()) {
            return ResponseEntity.status(403).body("Account disabled");
        }

        if (account.getProvider() == Provider.GOOGLE) {
            return ResponseEntity
                    .badRequest()
                    .body("Account uses Google login");
        }

        if (!passwordEncoder.matches(password, account.getPassword())) {
            return ResponseEntity.status(401).body("Wrong password");
        }

        String role = accountService.resolveRole(account.getId());
        Customer customer = customerService.findByAccount(account);

        String token = jwtService.generateToken(
                account.getUsername(),
                role,
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
        String password = req.get("password");

        if (accountService.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Username exists");
        }

        Account account = new Account();
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(password));
        account.setProvider(Provider.LOCAL);
        account.setEnabled(true);

        Account saved = accountService.save(account);

        accountService.createCustomerProfile(
                saved,
                req.get("fullName"),
                req.get("phone"),
                req.get("email"),
                req.get("address")
        );

        return ResponseEntity.ok("Register success");
    }

    // ================= LOGIN GOOGLE =================
    @PostMapping("/google")
    @Transactional
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest req) {

        var payload = googleVerifier.verify(req.getCredential());
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        // 1️⃣ LUÔN tìm account theo email
        Account account = accountService.findByUsername(email).orElse(null);

        if (account == null) {
            // 2️⃣ tạo account
            account = new Account();
            account.setUsername(email);
            account.setProvider(Provider.GOOGLE);
            account.setEnabled(true);

            account = accountService.save(account);

            // 3️⃣ tìm customer theo email (nếu có data cũ)
            Customer customer = customerService.findByEmail(email);

            if (customer != null) {
                customer.setAccount(account);
                customerService.save(customer);
            } else {
                // 4️⃣ chưa có → tạo mới
                accountService.createCustomerProfile(
                        account, name, null, email, null
                );
            }
        }

        // 5️⃣ LUÔN load customer qua account
        Customer customer = customerService.findByAccount(account);

        String token = jwtService.generateToken(
                account.getUsername(),
                accountService.resolveRole(account.getId()),
                customer.getId(),
                customer.getFullName()
        );

        return ResponseEntity.ok(Map.of("token", token));
    }

    // ================= ME =================
    @GetMapping("/me")
    public ResponseEntity<?> me(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        var claims = jwtService.extractClaims(token);

        return ResponseEntity.ok(
                Map.of(
                        "username", claims.getSubject(),
                        "role", claims.get("role"),
                        "customerId", claims.get("customerId"),
                        "fullName", claims.get("fullName")
                )
        );
    }
}

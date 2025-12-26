package org.example.case_study_module_6.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.case_study_module_6.dto.GoogleLoginRequest;
import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.entity.Provider;
import org.example.case_study_module_6.entity.VerificationToken;
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
    private final VerificationTokenService verificationTokenService;
    private final EmailService emailService;

    public AuthController(
            JwtService jwtService,
            AccountService accountService,
            CustomerService customerService,
            PasswordEncoder passwordEncoder,
            GoogleTokenVerifierService googleVerifier,
            VerificationTokenService verificationTokenService,
            EmailService emailService
    ) {
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
        this.googleVerifier = googleVerifier;
        this.verificationTokenService = verificationTokenService;
        this.emailService = emailService;
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

        if (!account.isEnabled()) {
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
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {

        // 1️⃣ check trùng username (email)
        if (accountService.existsByUsername(req.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email đã được đăng ký");
        }

        // 2️⃣ check trùng SĐT
        if (req.getPhoneNumber() != null &&
                customerService.existsByPhoneNumber(req.getPhoneNumber())) {
            return ResponseEntity
                    .badRequest()
                    .body("Số điện thoại đã tồn tại");
        }

        // 3️⃣ check trùng CCCD
        if (req.getIdentityCard() != null &&
                customerService.existsByIdentityCard(req.getIdentityCard())) {
            return ResponseEntity
                    .badRequest()
                    .body("CCCD đã tồn tại");
        }

        // 4️⃣ tạo account (CHƯA KÍCH HOẠT)
        Account account = new Account();
        account.setUsername(req.getUsername());
        account.setPassword(passwordEncoder.encode(req.getPassword()));
        account.setProvider(Provider.LOCAL);
        account.setEnabled(false); // 🔥 CHƯA VERIFY EMAIL

        Account savedAccount = accountService.save(account);

        // 5️⃣ tạo customer profile
        accountService.createCustomerProfile(savedAccount, req);

        // 6️⃣ tạo verification token
        VerificationToken token =
                verificationTokenService.create(savedAccount);

        // 7️⃣ gửi mail xác nhận
        String verifyLink =
                "http://localhost:5173/verify-email?token=" + token.getToken();

        // 👉 nếu chưa cấu hình mail, có thể log ra console
        System.out.println("VERIFY LINK: " + verifyLink);

        // 👉 khi có EmailService thì bật dòng dưới
         emailService.sendVerificationEmail(req.getEmail(), verifyLink);

        // 8️⃣ trả kết quả
        return ResponseEntity.ok(
                "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản"
        );
    }

    // ================= LOGIN GOOGLE =================
    @PostMapping("/google")
    @Transactional
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest req) {

        var payload = googleVerifier.verify(req.getCredential());
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        // 1️⃣ tìm customer theo email (NGƯỜI DÙNG)
        Customer customer = customerService.findByEmail(email);

        Account googleAccount = accountService.findByUsername(email).orElse(null);

        // 2️⃣ nếu customer đã tồn tại
        if (customer != null) {

            // 2.1 chưa có google account → tạo & LINK
            if (googleAccount == null) {
                googleAccount = new Account();
                googleAccount.setUsername(email);
                googleAccount.setProvider(Provider.GOOGLE);
                googleAccount.setEnabled(true);
                googleAccount = accountService.save(googleAccount);
            }

            // ❗ KHÔNG ghi đè account LOCAL
            // customer giữ nguyên account LOCAL
        }
        // 3️⃣ chưa có customer → tạo mới
        else {
            googleAccount = new Account();
            googleAccount.setUsername(email);
            googleAccount.setProvider(Provider.GOOGLE);
            googleAccount.setEnabled(true);
            googleAccount = accountService.save(googleAccount);

            RegisterRequest registerReq = new RegisterRequest();
            registerReq.setFullName(name);
            registerReq.setEmail(email);
            registerReq.setGender(Customer.Gender.KHAC);

            accountService.createCustomerProfile(googleAccount, registerReq);
            customer = customerService.findByEmail(email);
        }

        // 4️⃣ token LUÔN sinh từ CUSTOMER
        String token = jwtService.generateToken(
                email,
                accountService.resolveRole(customer.getAccount().getId()),
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
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        VerificationToken vt = verificationTokenService.validate(token);
        Account account = vt.getAccount();

        account.setEnabled(true);
        accountService.save(account);

        return ResponseEntity.ok("Xác nhận email thành công");
    }
}

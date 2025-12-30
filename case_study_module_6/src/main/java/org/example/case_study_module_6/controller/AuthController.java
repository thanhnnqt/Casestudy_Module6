package org.example.case_study_module_6.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.example.case_study_module_6.dto.ChangePasswordRequest;
import org.example.case_study_module_6.dto.GoogleLoginRequest;
import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.*;
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
    private final AuthService authService;

    public AuthController(
            JwtService jwtService,
            AccountService accountService,
            CustomerService customerService,
            PasswordEncoder passwordEncoder,
            GoogleTokenVerifierService googleVerifier,
            VerificationTokenService verificationTokenService,
            EmailService emailService,
            AuthService authService
    ) {
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
        this.googleVerifier = googleVerifier;
        this.verificationTokenService = verificationTokenService;
        this.emailService = emailService;
        this.authService = authService;
    }

    // ================= LOGIN (1 API – ALL ROLE) =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

        String username = req.get("username");
        String password = req.get("password");

        Account account = accountService.findByUsername(username).orElse(null);
        if (account == null) {
            return ResponseEntity.status(401).body("Không tìm thấy tài khoản");
        }

        if (!account.isEnabled()) {
            return ResponseEntity.status(403).body("Tài khoản chưa kích hoạt");
        }

        if (account.getProvider() == Provider.GOOGLE) {
            return ResponseEntity.badRequest().body("Account uses Google login");
        }

        if (!passwordEncoder.matches(password, account.getPassword())) {
            return ResponseEntity.status(401).body("Mật khẩu không đúng");
        }

        String role = accountService.resolveRole(account.getId());

        Long profileId = null;
        String fullName = account.getUsername();

        switch (role) {
            case "ADMIN" -> {
                Admin admin = accountService.findAdminByAccount(account);
                if (admin == null) return ResponseEntity.status(403).body("Không có quyền ADMIN");
                profileId = admin.getId();
                fullName = admin.getFullName();
            }
            case "EMPLOYEE" -> {
                Employee emp = accountService.findEmployeeByAccount(account);
                if (emp == null) return ResponseEntity.status(403).body("Không có quyền EMPLOYEE");
                profileId = emp.getId();
                fullName = emp.getFullName();
            }
            case "CUSTOMER" -> {
                Customer customer = customerService.findByAccount(account);
                if (customer == null) {
                    return ResponseEntity.status(400).body("Tài khoản chưa gắn khách hàng");
                }
                profileId = customer.getId();
                fullName = customer.getFullName();
            }
            default -> throw new RuntimeException("Role không hợp lệ");
        }

        String token = jwtService.generateToken(
                account.getUsername(),
                role,
                profileId,
                fullName
        );

        return ResponseEntity.ok(Map.of("token", token));
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {

        Map<String, String> errors = new java.util.HashMap<>();

        if (accountService.existsByUsername(req.getUsername())) {
            errors.put("username", "Tên đăng nhập đã tồn tại");
        }

        if (customerService.existsByEmail(req.getEmail())) {
            errors.put("email", "Email đã tồn tại");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        VerificationToken token = verificationTokenService.createFromRegister(req);
        String link = "http://localhost:5173/verify-email?token=" + token.getToken();
        emailService.sendVerificationEmail(req.getEmail(), link);

        return ResponseEntity.ok("Vui lòng kiểm tra email");
    }

    // ================= LOGIN GOOGLE =================
    @PostMapping("/google")
    @Transactional
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest req) {

        var payload = googleVerifier.verify(req.getCredential());
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        Customer customer = customerService.findByEmail(email);
        Account account = accountService.findByUsername(email).orElse(null);

        if (account == null) {
            account = new Account();
            account.setUsername(email);
            account.setProvider(Provider.GOOGLE);
            account.setEnabled(true);
            account = accountService.save(account);
        }

        if (customer == null) {
            RegisterRequest r = new RegisterRequest();
            r.setFullName(name);
            r.setEmail(email);
            r.setGender(Customer.Gender.KHAC);
            accountService.createCustomerProfile(account, r);
            customer = customerService.findByEmail(email);
        }

        String token = jwtService.generateToken(
                email,
                "ROLE_USER",
                customer.getId(),
                customer.getFullName()
        );

        return ResponseEntity.ok(Map.of("token", token));
    }

    // ================= CHANGE PASSWORD =================
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChangePasswordRequest req
    ) {
        String token = authHeader.substring(7);
        String username = jwtService.extractClaims(token).getSubject();
        authService.changePassword(username, req.getOldPassword(), req.getNewPassword());
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }
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
    @Transactional
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        VerificationToken vt = verificationTokenService.validate(token);
        RegisterRequest req = vt.getRegisterRequest();

        // LÚC NÀY MỚI TẠO ACCOUNT
        Account account = new Account();
        account.setUsername(req.getUsername());
        account.setPassword(passwordEncoder.encode(req.getPassword()));
        account.setProvider(Provider.LOCAL);
        account.setEnabled(true);

        account = accountService.save(account);

        accountService.createCustomerProfile(account, req);

        verificationTokenService.delete(vt);

        return ResponseEntity.ok("Xác nhận email thành công");
    }
}

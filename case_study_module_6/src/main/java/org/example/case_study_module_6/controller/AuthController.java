package org.example.case_study_module_6.controller;

import org.example.case_study_module_6.dto.GoogleLoginRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.service.impl.AccountService;
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

    public AuthController(
            JwtService jwtService,
            AccountService accountService,
            PasswordEncoder passwordEncoder,
            GoogleTokenVerifierService googleVerifier
    ) {
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.passwordEncoder = passwordEncoder;
        this.googleVerifier = googleVerifier;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

        String identifier = req.get("identifier");
        String password = req.get("password");

        Account account = accountService
                .findByIdentifier(identifier)
                .orElse(null);

        if (account == null) {
            return ResponseEntity.status(401)
                    .body("Tài khoản không tồn tại");
        }

        if (!passwordEncoder.matches(password, account.getPassword())) {
            return ResponseEntity.status(401)
                    .body("Sai mật khẩu");
        }

        String token = jwtService.generateToken(
                account.getEmail(),
                account.getUsername(),
                account.getRole()
        );

        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginGoogle(@RequestBody GoogleLoginRequest req) {
        try {
            var payload = googleVerifier.verify(req.getCredential());

            String email = payload.getEmail();

            // 🔹 tìm user theo email
            Account account = accountService.findByEmail(email)
                    .orElseGet(() -> {
                        Account newAcc = new Account();
                        newAcc.setEmail(email);
                        newAcc.setUsername(email);
                        newAcc.setRole("ROLE_USER");
                        newAcc.setPassword(""); // Google login không cần password
                        return accountService.save(newAcc);
                    });

            String token = jwtService.generateToken(
                    account.getEmail(),
                    account.getUsername(),
                    account.getRole()
            );

            return ResponseEntity.ok(Map.of("token", token));

        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body("Google token không hợp lệ");
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing token");
        }

        String token = authHeader.substring(7);

        try {
            var claims = jwtService.extractClaims(token);

            return ResponseEntity.ok(
                    Map.of(
                            "email", claims.getSubject(),
                            "username", claims.get("username"),
                            "role", claims.get("role")
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String username = req.get("username");
        String password = req.get("password");

        if (accountService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }

        Account account = new Account();
        account.setEmail(email);
        account.setUsername(username);
        account.setPassword(passwordEncoder.encode(password));
        account.setRole("ROLE_USER");

        accountService.save(account);

        return ResponseEntity.ok("Đăng ký thành công");
    }

}

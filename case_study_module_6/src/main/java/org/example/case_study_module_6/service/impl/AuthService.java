package org.example.case_study_module_6.service.impl;

import org.example.case_study_module_6.dto.RegisterRequest;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.entity.PasswordResetToken;
import org.example.case_study_module_6.entity.Provider;
import org.example.case_study_module_6.entity.VerificationToken;
import org.example.case_study_module_6.repository.IPasswordResetTokenRepository;
import org.example.case_study_module_6.service.IAccountService;
import org.example.case_study_module_6.service.IAuthService;
import org.example.case_study_module_6.service.ICustomerService;
import org.example.case_study_module_6.service.IEmailService;
import org.example.case_study_module_6.service.IVerificationTokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AuthService implements IAuthService {

    private final ICustomerService customerService;
    private final IPasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final IEmailService emailService;
    private final IAccountService accountService;
    private final IVerificationTokenService verificationTokenService;

    public AuthService(
            ICustomerService customerService,
            IPasswordResetTokenRepository resetTokenRepository,
            PasswordEncoder passwordEncoder,
            IEmailService emailService,
            IAccountService accountService,
            IVerificationTokenService verificationTokenService
    ) {
        this.customerService = customerService;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.accountService = accountService;
        this.verificationTokenService = verificationTokenService;
    }

    @Override
    public void forgotPassword(String email) {
        Customer customer = customerService.findByEmail(email);
        if (customer == null || customer.getAccount() == null) {
            return;
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiredAt(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);

        resetTokenRepository.save(resetToken);

        String resetLink = "http://192.168.1.30:5173/reset-password?token=" + token;

        emailService.send(
                email,
                "Password Reset Request",
                "Please click the link below to reset your password:\n" + resetLink
        );
    }

    @Override
    public void processEmailVerification(String token) {
        VerificationToken vt = verificationTokenService.validate(token);
        RegisterRequest req = vt.getRegisterRequest();

        // 1. Create Account
        Account account = new Account();
        account.setUsername(req.getUsername());
        account.setPassword(passwordEncoder.encode(req.getPassword()));
        account.setProvider(Provider.LOCAL);
        account.setEnabled(true);

        account = accountService.save(account);

        // 2. Create Profile
        accountService.createCustomerProfile(account, req);

        // 3. Delete token
        verificationTokenService.delete(vt);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = resetTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Token already used");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        Customer customer = customerService.findByEmail(resetToken.getEmail());
        if (customer == null || customer.getAccount() == null) {
            throw new RuntimeException("Account not found");
        }

        Account account = customer.getAccount();
        account.setPassword(passwordEncoder.encode(newPassword));
        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        Account account = accountService
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getProvider() == Provider.GOOGLE) {
            throw new RuntimeException("Google accounts cannot change password");
        }

        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new RuntimeException("Current password incorrect");
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        accountService.save(account);
    }
}

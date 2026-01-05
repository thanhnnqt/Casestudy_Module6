package org.example.case_study_module_6.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.entity.Account;
import org.example.case_study_module_6.entity.Customer;
import org.example.case_study_module_6.entity.PasswordResetToken;
import org.example.case_study_module_6.entity.Provider;
import org.example.case_study_module_6.repository.IPasswordResetTokenRepository;
import org.example.case_study_module_6.service.IAuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService implements IAuthService {

    private final CustomerService customerService;
    private final IPasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AccountService accountService;

    /**
     * =============================
     * QUÊN MẬT KHẨU
     * =============================
     */
    @Override
    public void forgotPassword(String email) {

        Customer customer = customerService.findByEmail(email);
        if (customer == null || customer.getAccount() == null) {
            return; // ❗ KHÔNG throw
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiredAt(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);

        resetTokenRepository.save(resetToken);

        String resetLink =
                "http://localhost:5173/reset-password?token=" + token;

        emailService.send(
                email,
                "Khôi phục mật khẩu",
                "Click vào link sau để đặt lại mật khẩu:\n" + resetLink
        );
    }

    /**
     * =============================
     * RESET MẬT KHẨU
     * =============================
     */
    @Override
    public void resetPassword(String token, String newPassword) {

        // 1️⃣ Kiểm tra token
        PasswordResetToken resetToken = resetTokenRepository
                .findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Token đã được sử dụng");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token đã hết hạn");
        }

        // 2️⃣ Lấy CUSTOMER theo email
        Customer customer =
                customerService.findByEmail(resetToken.getEmail());

        if (customer == null || customer.getAccount() == null) {
            throw new RuntimeException("Không tìm thấy tài khoản");
        }

        // 3️⃣ Đổi mật khẩu
        Account account = customer.getAccount();
        account.setPassword(passwordEncoder.encode(newPassword));

        // 4️⃣ Đánh dấu token đã dùng
        resetToken.setUsed(true);

        // ⚠️ account được save thông qua cascade hoặc service khác
        resetTokenRepository.save(resetToken);
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {

        Account account = accountService
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if (account.getProvider() == Provider.GOOGLE) {
            throw new RuntimeException("Tài khoản Google không thể đổi mật khẩu");
        }

        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }

        account.setPassword(passwordEncoder.encode(newPassword));
    }
}

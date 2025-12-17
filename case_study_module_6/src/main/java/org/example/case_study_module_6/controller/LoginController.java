package org.example.case_study_module_6.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.example.case_study_module_6.dto.LoginDTO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    /* ===== ĐĂNG NHẬP BẰNG USERNAME / EMAIL ===== */
    @PostMapping("/login")
    public String login(
            @Valid @ModelAttribute LoginDTO loginDTO,
            BindingResult result,
            HttpSession session,
            Model model
    ) {
        if (result.hasErrors()) {
            return "login";
        }

        // DEMO DATA
        boolean success =
                ("admin".equals(loginDTO.getUsernameOrEmail())
                        || "admin@gmail.com".equals(loginDTO.getUsernameOrEmail()))
                        && "Admin123".equals(loginDTO.getPassword());

        if (!success) {
            model.addAttribute("error", "Sai tài khoản/email hoặc mật khẩu");
            return "login";
        }

        session.setAttribute("user", loginDTO.getUsernameOrEmail());
        return "redirect:/";
    }

    /* ===== ĐĂNG NHẬP BẰNG LINK EMAIL ===== */
    @PostMapping("/login-by-email")
    public String loginByEmail(
            @RequestParam String email,
            Model model
    ) {
        // TODO: kiểm tra email có tồn tại trong DB

        // TODO: sinh token + lưu DB
        String token = "abc123";

        // TODO: gửi mail
        String loginLink = "http://localhost:8080/login-email?token=" + token;

        System.out.println("Login link: " + loginLink);

        model.addAttribute("message",
                "Vui lòng kiểm tra email để đăng nhập!");

        return "login-email-sent";
    }

    /* ===== VERIFY LINK EMAIL ===== */
    @GetMapping("/login-email")
    public String verifyLoginEmail(
            @RequestParam String token,
            HttpSession session
    ) {
        // TODO: kiểm tra token hợp lệ

        session.setAttribute("user", "email_user");
        return "redirect:/";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
    @GetMapping("/login")
    public String showLogin(Model model) {
        model.addAttribute("loginDTO", new LoginDTO());
        return "login";
    }
}
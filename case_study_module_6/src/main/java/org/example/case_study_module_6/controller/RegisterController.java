package org.example.case_study_module_6.controller;

import jakarta.validation.Valid;
import org.example.case_study_module_6.dto.RegisterDTO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Controller
public class RegisterController {

    @GetMapping("/register")
    public String showRegister(Model model) {
        model.addAttribute("registerDTO", new RegisterDTO());
        model.addAttribute("nationalities", List.of("Việt Nam", "Mỹ", "Nhật Bản", "Hàn Quốc"));
        return "register";
    }

    @PostMapping("/register")
    public String register(
            @Valid @ModelAttribute RegisterDTO registerDTO,
            BindingResult result,
            Model model
    ) {
        // kiểm tra xác nhận mật khẩu
        if (!registerDTO.getPassword().equals(registerDTO.getConfirmPassword())) {
            result.rejectValue("confirmPassword", "", "Mật khẩu xác nhận không khớp");
        }

        // kiểm tra tuổi
        int age = Period.between(registerDTO.getBirthDate(), LocalDate.now()).getYears();
        if (age < 18 || age > 150) {
            result.rejectValue("birthDate", "", "Tuổi phải từ 18 đến 150");
        }

        if (result.hasErrors()) {
            model.addAttribute("nationalities", List.of("Việt Nam", "Mỹ", "Nhật Bản", "Hàn Quốc"));
            return "register";
        }

        // TODO: kiểm tra email duy nhất trong DB

        return "redirect:/login";
    }
}

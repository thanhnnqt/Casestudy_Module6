package org.example.case_study_module_6.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // Dữ liệu mẫu cho banner/ưu đãi
        model.addAttribute("promotions", new String[]{
                "Khuyến mãi vé máy bay giá rẻ!",
                "Siêu giảm giá chặng Hà Nội - Sài Gòn",
                "Voucher 500K cho hội viên Vietjet SkyClub"
        });
        return "index";
    }
}
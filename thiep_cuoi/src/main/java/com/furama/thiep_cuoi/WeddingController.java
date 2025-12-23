package com.furama.thiep_cuoi; // Đảm bảo dòng này đúng với package của bạn

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WeddingController {

    // Khi người dùng truy cập vào đường dẫn gốc (localhost:8080)
    @GetMapping("/")
    public String showWeddingPage() {
        // Trả về tên file HTML trong thư mục templates (không cần đuôi .html)
        return "index";
    }
}
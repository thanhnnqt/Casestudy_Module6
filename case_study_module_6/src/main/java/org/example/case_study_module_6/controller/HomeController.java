package org.example.case_study_module_6.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("cities", List.of(
                "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng",
                "Nha Trang", "Phú Quốc", "Cần Thơ"
        ));
        return "index";
    }

    // 6.4.5 – Danh sách vé
    @GetMapping("/search-flight")
    public String searchFlight(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String departureDate,
            @RequestParam(required = false) String returnDate,
            @RequestParam int adult,
            @RequestParam int child,
            @RequestParam int infant,
            Model model
    ) {
        // TODO: xử lý tìm vé trong DB

        model.addAttribute("from", from);
        model.addAttribute("to", to);
        model.addAttribute("departureDate", departureDate);
        model.addAttribute("returnDate", returnDate);
        model.addAttribute("adult", adult);
        model.addAttribute("child", child);
        model.addAttribute("infant", infant);

        return "flight-list"; // trang 6.4.5
    }
}
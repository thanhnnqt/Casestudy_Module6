package org.example.case_study_module_6.controller;

import org.example.case_study_module_6.entity.News;
import org.example.case_study_module_6.service.INewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @Autowired
    private INewsService newsService;

    // 1. Lấy tất cả (đã có)
    @GetMapping
    public ResponseEntity<List<News>> getHomeNews() {
        return ResponseEntity.ok(newsService.getAllActiveNews());
    }

    // 2. THÊM MỚI: Lấy chi tiết tin tức theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getNewsById(@PathVariable Integer id) {
        // Lưu ý: Bạn cần đảm bảo NewsRepository có hàm findById (mặc định JpaRepository đã có)
        // Trong service bạn có thể viết hàm getById hoặc gọi repository trực tiếp nếu đơn giản
        // Ở đây tôi giả sử bạn gọi qua service (bạn cần thêm hàm này vào Service nhé)
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    // API Thêm mới
    @PostMapping
    public ResponseEntity<?> createNews(@RequestBody News news) {
        try {
            return ResponseEntity.ok(newsService.addNews(news));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi thêm mới: " + e.getMessage());
        }
    }

    // API Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNews(@PathVariable Integer id, @RequestBody News news) {
        try {
            return ResponseEntity.ok(newsService.updateNews(id, news));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // API Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNews(@PathVariable Integer id) {
        try {
            newsService.deleteNews(id);
            return ResponseEntity.ok("Xóa thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xóa: " + e.getMessage());
        }
    }
}
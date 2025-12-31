package org.example.case_study_module_6.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.case_study_module_6.entity.News;
import org.example.case_study_module_6.repository.IAccountRepository;
import org.example.case_study_module_6.repository.INewsRepository;
import org.example.case_study_module_6.service.INewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NewsService implements INewsService {

    @Autowired
    private IAccountRepository accountRepository;

    private final INewsRepository newsRepository;

    @Override
    public List<News> getAllActiveNews() {
        // Chỉ lấy những tin đang active
        return newsRepository.findAllByIsActiveTrueOrderByPublishedAtDesc();
    }

    @Override
    public Optional<News> getNewsById(Integer id) {
        return newsRepository.findById(id);
    }

    // 1. THÊM MỚI
    @Override
    public News addNews(News news) {
        news.setPublishedAt(LocalDateTime.now());
        news.setUpdatedAt(LocalDateTime.now());
        news.setIsActive(true);

        // Mặc định gán cho Admin (ID=1) để không bị lỗi null
        // Thực tế bạn sẽ lấy ID từ SecurityContextHolder (người đang đăng nhập)
        news.setAccount(accountRepository.findById(1L).orElse(null));

        return newsRepository.save(news);
    }

    // 2. CẬP NHẬT
    @Override
    public News updateNews(Integer id, News newsDetails) {
        // SỬA DÒNG NÀY:
        News existingNews = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết ID: " + id));

        // Hoặc nếu muốn dùng hàm getNewsById ở trên:
        // News existingNews = getNewsById(id)
        //        .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết ID: " + id));

        // Các dòng set dữ liệu giữ nguyên
        existingNews.setTitle(newsDetails.getTitle());
        existingNews.setSummary(newsDetails.getSummary());
        existingNews.setContent(newsDetails.getContent());
        existingNews.setThumbnail(newsDetails.getThumbnail());
        existingNews.setCategory(newsDetails.getCategory());
        existingNews.setUpdatedAt(LocalDateTime.now());

        return newsRepository.save(existingNews);
    }

    // 3. XÓA
    @Override
    public void deleteNews(Integer id) {
        newsRepository.deleteById(id);
    }
}
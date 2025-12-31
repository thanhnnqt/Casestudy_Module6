package org.example.case_study_module_6.repository;

import org.example.case_study_module_6.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INewsRepository extends JpaRepository<News, Integer> {
    // Lấy danh sách tin tức đang hoạt động (isActive = true), mới nhất lên đầu
    List<News> findAllByIsActiveTrueOrderByPublishedAtDesc();
}
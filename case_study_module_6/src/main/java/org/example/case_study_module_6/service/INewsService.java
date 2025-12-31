package org.example.case_study_module_6.service;

import org.example.case_study_module_6.entity.News;
import org.jspecify.annotations.Nullable;

import java.util.List;
import java.util.Optional;

public interface INewsService {
    List<News> getAllActiveNews();

    Optional<News> getNewsById(Integer id);

    News updateNews(Integer id, News newsDetails);

    News addNews(News news);

    public void deleteNews(Integer id);
}
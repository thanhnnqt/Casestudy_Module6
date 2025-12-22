package org.example.case_study_module_6.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer newsId;

    private String title;
    private String slug;
    private String summary;
    private String email;

    @Lob
    private String content;

    private String thumbnail;

    @Enumerated(EnumType.STRING)
    private Category category;

    private Boolean isActive = true;

    private LocalDateTime publishedAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    public enum Category {
        NEWS, PROMOTION, ANNOUNCEMENT
    }
}


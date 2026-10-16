package com.bang9634.yasongmuseum.notice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.bang9634.yasongmuseum.common.entity.BaseEntity;
import com.bang9634.yasongmuseum.user.entity.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notices")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notice extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeCategory category;

    @Column(nullable = false)
    private Boolean isPinned = false;

    @Column(nullable = false)
    private Integer viewCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NoticeStatus status = NoticeStatus.PUBLISHED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NoticeAttachment> attachments = new ArrayList<>();

    @Column
    private LocalDateTime deletedAt;

    public void increaseViewCount() {
        this.viewCount++;
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public boolean isVisible() {
        if (deletedAt != null) return false;
        if (status != NoticeStatus.PUBLISHED) return false;

        return true;
    }
}

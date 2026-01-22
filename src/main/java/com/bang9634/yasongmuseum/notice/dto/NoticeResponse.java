package com.bang9634.yasongmuseum.notice.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.notice.entity.Notice;
import com.bang9634.yasongmuseum.notice.entity.NoticeCategory;
import com.bang9634.yasongmuseum.notice.entity.NoticeStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeResponse {

    private Long id;
    private String title;
    private String content;
    private NoticeCategory category;
    private Boolean isPinned;
    private Integer viewCount;
    private NoticeStatus status;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static NoticeResponse from(Notice notice) {
        return NoticeResponse.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .category(notice.getCategory())
                .isPinned(notice.getIsPinned())
                .viewCount(notice.getViewCount())
                .status(notice.getStatus())
                .authorId(notice.getAuthor().getId())
                .authorName(notice.getAuthor().getName())
                .createdAt(notice.getCreatedAt())
                .updatedAt(notice.getUpdatedAt())
                .build();
    }
}

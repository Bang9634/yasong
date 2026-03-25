package com.bang9634.yasongmuseum.photo.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.photo.entity.Photo;

import lombok.Builder;
import lombok.Data;

/**
 * Photo summary response for list view
 * Excludes description to reduce payload size
 */
@Data
@Builder
public class PhotoSummaryResponse {

    private Long id;
    private String title;
    private String imageUrl;
    private LocalDateTime createdAt;

    public static PhotoSummaryResponse from(Photo photo) {
        return PhotoSummaryResponse.builder()
                .id(photo.getId())
                .title(photo.getTitle())
                .imageUrl(photo.getImageUrl())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}

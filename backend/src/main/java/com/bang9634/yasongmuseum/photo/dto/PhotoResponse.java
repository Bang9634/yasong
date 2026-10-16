package com.bang9634.yasongmuseum.photo.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.photo.entity.Photo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PhotoResponse {

    private Long id;
    private String title;
    private String imageUrl;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PhotoResponse from(Photo photo) {
        return PhotoResponse.builder()
                .id(photo.getId())
                .title(photo.getTitle())
                .imageUrl(photo.getImageUrl())
                .description(photo.getDescription())
                .createdAt(photo.getCreatedAt())
                .updatedAt(photo.getUpdatedAt())
                .build();
    }
}

package com.bang9634.yasongmuseum.website.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageResponse {

    private String imageUrl;
    private LocalDateTime updatedAt;
}

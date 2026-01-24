package com.bang9634.yasongmuseum.souvenir.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.souvenir.entity.Souvenir;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SouvenirResponse {
    
    private Long id;
    private String name;
    private String imageUrl;
    private String description;
    private Double price;
    private Boolean isPinned;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SouvenirResponse from(Souvenir souvenir) {
        return SouvenirResponse.builder()
                .id(souvenir.getId())
                .name(souvenir.getName())
                .imageUrl(souvenir.getImageUrl())
                .description(souvenir.getDescription())
                .price(souvenir.getPrice())
                .isPinned(souvenir.getIsPinned())
                .createdAt(souvenir.getCreatedAt())
                .updatedAt(souvenir.getUpdatedAt())
                .build();
    }
}

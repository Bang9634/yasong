package com.bang9634.yasongmuseum.exhibition.dto;

import com.bang9634.yasongmuseum.exhibition.entity.ExhibitionStatus;
import com.bang9634.yasongmuseum.exhibition.entity.ExhibitionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExhibitionResponse {

    private Long id;
    private String title;
    private String artist;
    private String location;
    private String imageUrl;
    private String description;
    private ExhibitionType type;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ExhibitionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

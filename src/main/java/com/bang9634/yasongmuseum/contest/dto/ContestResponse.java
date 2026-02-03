package com.bang9634.yasongmuseum.contest.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.contest.entity.Contest;
import com.bang9634.yasongmuseum.contest.entity.ContestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestResponse {
    
    private Long id;
    private String title;
    private String location;
    private String imageUrl;
    private String host;
    private String description;
    private String announcementUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ContestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ContestResponse from(Contest contest) {
        return ContestResponse.builder()
                .id(contest.getId())
                .title(contest.getTitle())
                .location(contest.getLocation())
                .imageUrl(contest.getImageUrl())
                .host(contest.getHost())
                .description(contest.getDescription())
                .announcementUrl(contest.getAnnouncementUrl())
                .startDate(contest.getStartDate())
                .endDate(contest.getEndDate())
                .status(contest.getStatus())
                .createdAt(contest.getCreatedAt())
                .updatedAt(contest.getUpdatedAt())
                .build();
    }
}

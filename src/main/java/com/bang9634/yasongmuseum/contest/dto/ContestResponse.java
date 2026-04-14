package com.bang9634.yasongmuseum.contest.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.bang9634.yasongmuseum.contest.entity.Contest;
import com.bang9634.yasongmuseum.contest.entity.ContestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Contest Response DTO
 * Client-friendly representation of contest data
 * 
 * Design Notes:
 * - Includes attachments for single contest view (detail page)
 * - Attachments are optional and lazily loaded
 * - Status is calculated dynamically based on dates
 * 
 * @see Contest
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestResponse {
    
    private Long id;
    private String title;
    private String location;
    
    /**
     * Main contest image URL
     * Used for thumbnails and hero images
     */
    private String imageUrl;
    
    private String host;
    private String description;
    private String announcementUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
    /**
     * Contest status (UPCOMING, ONGOING, PAST)
     * Calculated dynamically based on current date
     */
    private ContestStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Attached documents (PDFs, forms, etc.)
     * Empty list if no attachments
     */
    private List<ContestAttachmentResponse> attachments;

    /**
     * Factory method to create DTO from entity
     * Includes attachments for complete contest information
     * 
     * @param contest Contest entity
     * @return ContestResponse DTO with all data
     */
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
                .attachments(contest.getAttachments() != null 
                    ? contest.getAttachments().stream()
                        .map(ContestAttachmentResponse::from)
                        .collect(Collectors.toList())
                    : List.of())
                .build();
    }
}

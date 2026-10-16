package com.bang9634.yasongmuseum.contest.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.bang9634.yasongmuseum.common.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contests")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contest extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String location;
    
    @Column(nullable = false, length = 1000)
    private String imageUrl;
        
    @Column(nullable = false, length = 1000)
    private String host;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 1000)
    private String announcementUrl;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    /**
     * Attached files (PDFs, documents, forms, etc.)
     * 
     * Design Notes:
     * - CASCADE.ALL: When contest is deleted, all attachments are deleted
     * - orphanRemoval=true: When attachment is removed from list, it's deleted from DB
     * - LAZY fetch: Attachments loaded only when needed
     * - @Builder.Default: Initialize empty list to prevent NullPointerException
     * 
     * Usage:
     * - contest.getAttachments().add(attachment) - Add new attachment
     * - contest.getAttachments().remove(attachment) - Remove and delete
     */
    @OneToMany(mappedBy = "contest", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ContestAttachment> attachments = new ArrayList<>();

    /**
     * Calculate contest status based on current date
     */
    public ContestStatus getStatus() {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(startDate)) {
            return ContestStatus.UPCOMING;
        } else if (now.isAfter(endDate)) {
            return ContestStatus.PAST;
        } else {
            return ContestStatus.ONGOING;
        }
    }
}

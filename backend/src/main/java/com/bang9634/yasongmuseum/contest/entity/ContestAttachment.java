package com.bang9634.yasongmuseum.contest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Contest Attachment Entity
 * Stores metadata for files attached to contests (PDFs, documents, forms, etc.)
 * 
 * Design Notes:
 * - Separate from ContestImage to allow different file types and validation
 * - Uses CASCADE.ALL and orphanRemoval=true for automatic cleanup
 * - Tracks file metadata for download functionality and storage management
 * 
 * @see Contest
 * @see com.bang9634.yasongmuseum.notice.entity.NoticeAttachment Similar pattern
 */
@Entity
@Table(name = "contest_attachments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    /**
     * Original filename as uploaded by user
     * Used for download filename
     */
    @Column(nullable = false, length = 255)
    private String fileName;

    /**
     * Server-side file URL
     * Format: /uploads/contests/{uuid}.{extension}
     */
    @Column(nullable = false, length = 500)
    private String fileUrl;

    /**
     * File size in bytes
     * Used for display and storage quota management
     */
    @Column(nullable = false)
    private Long fileSize;

    /**
     * MIME content type (e.g., application/pdf, image/jpeg)
     * Used for validation and download headers
     */
    @Column(nullable = false, length = 100)
    private String contentType;

    /**
     * Upload timestamp
     * Immutable after creation
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}

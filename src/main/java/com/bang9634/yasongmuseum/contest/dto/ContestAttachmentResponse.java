package com.bang9634.yasongmuseum.contest.dto;

import com.bang9634.yasongmuseum.contest.entity.ContestAttachment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Contest Attachment Response DTO
 * Provides client-friendly representation of contest attachments
 * 
 * Design Notes:
 * - Includes both fileUrl (storage path) and downloadUrl (API endpoint)
 * - Provides formatted file size for UI display
 * - Immutable after construction (no setters used in business logic)
 * 
 * Usage Examples:
 * - List attachments on contest detail page
 * - Download attachment via downloadUrl
 * - Display file metadata (size, type, upload date)
 * 
 * @see ContestAttachment
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestAttachmentResponse {
    
    /**
     * Attachment ID (for deletion and download)
     */
    private Long id;
    
    /**
     * Original filename as uploaded
     */
    private String fileName;
    
    /**
     * Server-side storage URL
     * Format: /uploads/contests/{uuid}.{extension}
     */
    private String fileUrl;
    
    /**
     * API endpoint for downloading with original filename
     * Format: /api/files/contest-attachments/{id}
     */
    private String downloadUrl;
    
    /**
     * File size in bytes
     */
    private Long fileSize;
    
    /**
     * MIME content type
     * Examples: application/pdf, image/png, application/msword
     */
    private String contentType;
    
    /**
     * Upload timestamp
     */
    private LocalDateTime uploadedAt;
    
    /**
     * Factory method to create DTO from entity
     * 
     * @param attachment ContestAttachment entity
     * @return ContestAttachmentResponse DTO
     */
    public static ContestAttachmentResponse from(ContestAttachment attachment) {
        return ContestAttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileUrl(attachment.getFileUrl())
                .downloadUrl("/api/files/contest-attachments/" + attachment.getId())
                .fileSize(attachment.getFileSize())
                .contentType(attachment.getContentType())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
    
    /**
     * Get human-readable file size
     * Converts bytes to KB/MB for display
     * 
     * @return Formatted file size (e.g., "1.5 MB", "256 KB")
     */
    public String getFileSizeFormatted() {
        if (fileSize == null) return "0 B";
        
        if (fileSize < 1024) {
            return fileSize + " B";
        } else if (fileSize < 1024 * 1024) {
            return String.format("%.1f KB", fileSize / 1024.0);
        } else {
            return String.format("%.1f MB", fileSize / (1024.0 * 1024.0));
        }
    }
    
    /**
     * Check if file is a document type
     * Useful for displaying appropriate icons
     * 
     * @return true if document (PDF, DOC, XLS, etc.)
     */
    public boolean isDocument() {
        if (contentType == null) return false;
        return contentType.startsWith("application/") && 
               !contentType.equals("application/zip");
    }
    
    /**
     * Check if file is an image type
     * 
     * @return true if image (PNG, JPG, GIF, etc.)
     */
    public boolean isImage() {
        if (contentType == null) return false;
        return contentType.startsWith("image/");
    }
}

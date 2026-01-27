package com.bang9634.yasongmuseum.notice.dto;

import com.bang9634.yasongmuseum.notice.entity.NoticeAttachment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeAttachmentResponse {
    
    private Long id;
    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String contentType;
    private LocalDateTime uploadedAt;
    
    public static NoticeAttachmentResponse from(NoticeAttachment attachment) {
        return NoticeAttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileUrl(attachment.getFileUrl())
                .fileSize(attachment.getFileSize())
                .contentType(attachment.getContentType())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
    
    /**
     * Get human-readable file size
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
}

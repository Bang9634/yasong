package com.bang9634.yasongmuseum.updatelog.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.updatelog.entity.UpdateLog;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLogResponse {
    
    private Long id;
    private String title;
    private String version;
    private LocalDate updateDate;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UpdateLogResponse from(UpdateLog log) {
        return UpdateLogResponse.builder()
                .id(log.getId())
                .title(log.getTitle())
                .version(log.getVersion())
                .updateDate(log.getUpdateDate())
                .content(log.getContent())
                .createdAt(log.getCreatedAt())
                .updatedAt(log.getUpdatedAt())
                .build();
    }
}

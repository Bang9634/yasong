package com.bang9634.yasongmuseum.legal.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.legal.entity.LegalTerm;
import com.bang9634.yasongmuseum.legal.entity.TermType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalTermResponse {
    
    private Long id;
    private TermType type;
    private String version;
    private String content;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LegalTermResponse from(LegalTerm term) {
        return LegalTermResponse.builder()
                .id(term.getId())
                .type(term.getType())
                .version(term.getVersion())
                .content(term.getContent())
                .startDate(term.getStartDate())
                .endDate(term.getEndDate())
                .isActive(term.getIsActive())
                .createdAt(term.getCreatedAt())
                .updatedAt(term.getUpdatedAt())
                .build();
    }
}

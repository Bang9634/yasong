package com.bang9634.yasongmuseum.legal.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.legal.entity.LegalTerm;
import com.bang9634.yasongmuseum.legal.entity.TermType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Legal Term Summary Response (without content)
 * Used for listing historical versions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalTermSummaryResponse {
    
    private Long id;
    private TermType type;
    private String version;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public static LegalTermSummaryResponse from(LegalTerm term) {
        return LegalTermSummaryResponse.builder()
                .id(term.getId())
                .type(term.getType())
                .version(term.getVersion())
                .startDate(term.getStartDate())
                .endDate(term.getEndDate())
                .isActive(term.getIsActive())
                .createdAt(term.getCreatedAt())
                .build();
    }
}

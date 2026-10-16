package com.bang9634.yasongmuseum.legal.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.legal.entity.TermType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLegalTermRequest {
    
    @NotNull(message = "타입은 필수입니다.")
    private TermType type;
    
    @NotBlank(message = "버전은 필수입니다.")
    private String version;
    
    @NotBlank(message = "내용은 필수입니다.")
    private String content;
    
    @NotNull(message = "시작일은 필수입니다.")
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
}

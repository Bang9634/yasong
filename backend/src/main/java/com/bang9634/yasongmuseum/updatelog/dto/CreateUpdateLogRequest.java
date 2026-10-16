package com.bang9634.yasongmuseum.updatelog.dto;

import java.time.LocalDate;

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
public class CreateUpdateLogRequest {
    
    @NotBlank(message = "제목은 필수입니다.")
    private String title;
    
    @NotBlank(message = "버전은 필수입니다.")
    private String version;
    
    @NotNull(message = "업데이트 날짜는 필수입니다.")
    private LocalDate updateDate;
    
    @NotBlank(message = "내용은 필수입니다.")
    private String content;
}

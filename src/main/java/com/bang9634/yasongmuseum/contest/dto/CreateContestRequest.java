package com.bang9634.yasongmuseum.contest.dto;

import java.time.LocalDateTime;

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
public class CreateContestRequest {
    
    @NotBlank(message = "제목은 필수입니다.")
    private String title;
    
    @NotBlank(message = "장소는 필수입니다.")
    private String location;
    
    @NotBlank(message = "이미지 URL은 필수입니다.")
    private String imageUrl;
    
    @NotBlank(message = "주최자는 필수입니다.")
    private String host;
    
    @NotBlank(message = "설명은 필수입니다.")
    private String description;
    
    @NotBlank(message = "공고 URL은 필수입니다.")
    private String announcementUrl;
    
    @NotNull(message = "시작일은 필수입니다.")
    private LocalDateTime startDate;
    
    @NotNull(message = "종료일은 필수입니다.")
    private LocalDateTime endDate;
}

package com.bang9634.yasongmuseum.exhibition.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateExhibitionRequest {

    @NotBlank(message = "전시명은 필수입니다.")
    private String title;

    @NotBlank(message = "작가명은 필수입니다.")
    private String artist;

    @NotBlank(message = "장소는 필수입니다.")
    private String location;

    @NotBlank(message = "설명은 필수입니다.")
    private String description;

    @NotNull(message = "시작일은 필수입니다.")
    private LocalDateTime startDate;

    @NotNull(message = "종료일은 필수입니다.")
    private LocalDateTime endDate;
}

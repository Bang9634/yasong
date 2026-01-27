package com.bang9634.yasongmuseum.collection.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCollectionRequest {

    @NotBlank(message = "작품명은 필수입니다.")
    private String title;

    @NotBlank(message = "제작년도는 필수입니다.")
    private String year;

    @NotBlank(message = "크기는 필수입니다.")
    private String size;

    @NotBlank(message = "설명은 필수입니다.")
    private String description;

    @NotBlank(message = "작가명은 필수입니다.")
    private String artist;

    private Boolean isPinned = false;
}

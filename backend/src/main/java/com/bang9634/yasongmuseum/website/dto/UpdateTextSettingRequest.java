package com.bang9634.yasongmuseum.website.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTextSettingRequest {

    @NotBlank(message = "설정 값은 필수입니다.")
    private String value;
}

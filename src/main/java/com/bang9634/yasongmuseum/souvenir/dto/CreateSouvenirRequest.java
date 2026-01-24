package com.bang9634.yasongmuseum.souvenir.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSouvenirRequest {
    
    @NotBlank(message = "기념품 이름은 필수입니다")
    private String name;

    @NotBlank(message = "설명은 필수입니다")
    private String description;

    @NotNull(message = "가격은 필수입니다")
    @Positive(message = "가격은 0보다 커야 합니다")
    private Double price;
}

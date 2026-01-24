package com.bang9634.yasongmuseum.souvenir.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSouvenirRequest {
    
    private String name;
    private String description;

    @Positive(message = "가격은 0보다 커야 합니다")
    private Double price;

    private Boolean isPinned;
}

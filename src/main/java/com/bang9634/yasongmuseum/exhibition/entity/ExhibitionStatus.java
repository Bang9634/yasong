package com.bang9634.yasongmuseum.exhibition.entity;

import lombok.Getter;

/**
 * Exhibition Status Enum
 * Automatically calculated based on current date and exhibition dates
 */
@Getter
public enum ExhibitionStatus {
    UPCOMING("전시 예정"),
    ONGOING("전시 중"),
    PAST("지난 전시");

    private final String description;

    ExhibitionStatus(String description) {
        this.description = description;
    }
}

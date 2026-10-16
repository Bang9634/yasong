package com.bang9634.yasongmuseum.contest.entity;

import lombok.Getter;

/**
 * Contest Status Enum
 * Automatically calculated based on current date and contest dates
 */
@Getter
public enum ContestStatus {
    UPCOMING("진행 예정"),
    ONGOING("진행 중"),
    PAST("종료됨");

    private final String description;

    ContestStatus(String description) {
        this.description = description;
    }
}

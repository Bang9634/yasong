package com.bang9634.yasongmuseum.notice.entity;

public enum NoticeCategory {
    GENERAL("일반"),
    EXHIBITION("전시"),
    MAINTENANCE("시스템"),
    CONTEST("공모전");

    private final String description;

    NoticeCategory(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
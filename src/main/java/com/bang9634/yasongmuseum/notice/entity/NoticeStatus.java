package com.bang9634.yasongmuseum.notice.entity;

public enum NoticeStatus {
    DRAFT("임시 저장"),
    PUBLISHED("게시됨"),
    HIDDEN("숨김");

    private final String description;

    NoticeStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

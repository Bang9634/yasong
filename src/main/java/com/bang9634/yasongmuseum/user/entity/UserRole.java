package com.bang9634.yasongmuseum.user.entity;

public enum UserRole {
    USER("일반 사용자"),
    MANAGER("운영 관리자"),
    ADMIN("최고 관리자");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}

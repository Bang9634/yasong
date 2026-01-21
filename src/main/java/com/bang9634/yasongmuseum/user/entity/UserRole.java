package com.bang9634.yasongmuseum.user.entity;

/**
 * User Role Enum
 * Defines the roles available for users in the system.
 */
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

    /**
     * Gets the authority string for the role.
     * 
     * @return the authority string (e.g., "ROLE_USER")
     */
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}

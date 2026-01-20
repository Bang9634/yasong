package com.bang9634.yasongmuseum.user.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.entity.UserRole;

import lombok.Builder;
import lombok.Data;

/**
 * User Response DTO
 * Used for transferring user data in responses.
 * 
 * @apiNote Excludes sensitive information like passwords.
 */
@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String name;
    private UserRole role;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

package com.bang9634.yasongmuseum.auth.dto;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.user.entity.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authentication response DTO
 * Contains user details and authentication token.
 * 
 * @apiNote message field is deprecated and will be removed in future versions.
 *          so, recommended to avoid using message field.
 *          Success messages should be managed on the client side.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String email;
    private String username;
    private String name;
    private UserRole role;
    private String token;
    private LocalDateTime createdAt;

    // success message is managed in client side, so this field is deprecated
    @Deprecated
    private String message;
}

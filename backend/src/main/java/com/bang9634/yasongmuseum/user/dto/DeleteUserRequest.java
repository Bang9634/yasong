package com.bang9634.yasongmuseum.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Delete User Request DTO
 * Used for transferring data when deleting a user account.
 */
@Data
public class DeleteUserRequest {
    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;
}

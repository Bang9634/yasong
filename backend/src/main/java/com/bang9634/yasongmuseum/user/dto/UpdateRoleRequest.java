package com.bang9634.yasongmuseum.user.dto;

import com.bang9634.yasongmuseum.user.entity.UserRole;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateRoleRequest {
    @NotNull(message = "권한은 필수입니다.")
    private UserRole role;
    
}

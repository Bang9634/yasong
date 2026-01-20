package com.bang9634.yasongmuseum.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.user.dto.UserResponse;
import com.bang9634.yasongmuseum.user.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * User Controller
 * Handles user-related endpoints.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    /**
     * Get current user info
     * 
     * @param username Injected from authentication principal
     * @return Current user information
     * 
     * @apiNote Client does not need to provide username.
     *          The username is extracted from the authenticated principal.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal String username) {
        UserResponse user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }
}

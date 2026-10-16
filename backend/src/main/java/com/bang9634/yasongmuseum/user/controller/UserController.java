package com.bang9634.yasongmuseum.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.user.dto.ChangePasswordRequest;
import com.bang9634.yasongmuseum.user.dto.DeleteUserRequest;
import com.bang9634.yasongmuseum.user.dto.UpdateUserRequest;
import com.bang9634.yasongmuseum.user.dto.UserResponse;
import com.bang9634.yasongmuseum.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


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

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse updatedUser = userService.updateUserByUsername(username, request);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(
            @AuthenticationPrincipal String username, 
            @Valid @RequestBody DeleteUserRequest request) {
        userService.deleteUserByUsername(username, request);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePasswordCurrentUser(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePasswordByUsername(username, request);
        return ResponseEntity.noContent().build();
    }
}

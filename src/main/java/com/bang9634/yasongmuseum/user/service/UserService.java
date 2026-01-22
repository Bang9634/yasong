package com.bang9634.yasongmuseum.user.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.user.dto.ChangePasswordRequest;
import com.bang9634.yasongmuseum.user.dto.DeleteUserRequest;
import com.bang9634.yasongmuseum.user.dto.UpdateUserRequest;
import com.bang9634.yasongmuseum.user.dto.UserResponse;
import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.entity.UserRole;
import com.bang9634.yasongmuseum.user.exception.DuplicateEmailException;
import com.bang9634.yasongmuseum.user.exception.InvalidPasswordException;
import com.bang9634.yasongmuseum.user.exception.UserNotFoundException;
import com.bang9634.yasongmuseum.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * User Service
 * Handles user-related business logic.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getUserByUsername(String username) {
        log.info("Fetching user by username: {}", username);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> {
                log.error("User not found with username: {}", username);
                return new UserNotFoundException("사용자를 찾을 수 없습니다.");
            });

        log.info("User found: {}", user.getUsername());
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateUserByUsername(String username, UpdateUserRequest request) {
        log.info("Updating user by username: {}", username);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        if (!user.getEmail().equals(request.getEmail()) &&
            userRepository.existsByEmail(request.getEmail())) {
            log.error("Email already in use: {}", request.getEmail());
            throw new DuplicateEmailException("이미 사용 중인 이메일입니다.");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);
        log.info("User updated successfully: {}", updatedUser.getUsername());

        return UserResponse.from(updatedUser);
    }

    @Transactional
    public void deleteUserByUsername(String username, DeleteUserRequest request) {
        log.info("Deleting user by username: {}", username);

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Password does not match for user: {}", username);
            throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
        }

        userRepository.delete(user);
        log.info("User deleted successfully: {}", username);
    }

    @Transactional
    public void changePasswordByUsername(String username, ChangePasswordRequest request) {
        log.info("Changing password for user: {}", username);

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            log.error("Current password does not match for user: {}", username);
            throw new InvalidPasswordException("현재 비밀번호가 일치하지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed successfully: {}", username);
    }

    public List<UserResponse> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        log.info("Total users found: {}", users.size());
        return users.stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse updateUserRole(Long id, UserRole newRole) {
        log.info("Updating role for user ID: {}", id);

        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));
        
        user.setRole(newRole);
        userRepository.save(user);

        log.info("User role updated successfully: {} - {}", user.getUsername(), newRole);
        return UserResponse.from(user);
    }

    @Transactional
    public void deleteUserById(Long id) {
        log.info("Deleting user by ID: {}", id);

        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        userRepository.delete(user);
        log.info("User deleted successfully: {}", id);
    }
}
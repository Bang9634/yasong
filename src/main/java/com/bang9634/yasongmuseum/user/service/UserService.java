package com.bang9634.yasongmuseum.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.common.exception.UserNotFoundException;
import com.bang9634.yasongmuseum.user.dto.UserResponse;
import com.bang9634.yasongmuseum.user.entity.User;
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
}
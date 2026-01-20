package com.bang9634.yasongmuseum.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.common.exception.UserNotFoundException;
import com.bang9634.yasongmuseum.user.dto.UserResponse;
import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * User Service
 * Handles user-related business logic.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(()-> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        return UserResponse.from(user);
    }
}
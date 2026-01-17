package com.bang9634.yasongmuseum.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.auth.dto.AuthResponse;
import com.bang9634.yasongmuseum.auth.dto.LoginRequest;
import com.bang9634.yasongmuseum.auth.dto.SignupRequest;
import com.bang9634.yasongmuseum.common.exception.DuplicateEmailException;
import com.bang9634.yasongmuseum.common.exception.InvalidPasswordException;
import com.bang9634.yasongmuseum.common.exception.UserNotFoundException;
import com.bang9634.yasongmuseum.common.security.JwtTokenProvider;
import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Authentication Service
 * Handles user signup and login logic.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("이미 사용 중인 이메일입니다.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .createdAt(savedUser.getCreatedAt())
                .message("회원가입이 완료되었습니다.")
                .build();
    }


    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    return new UserNotFoundException("사용자를 찾을 수 없습니다.");
        });
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.createToken(user.getEmail(), user.getId());
        
        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .token(token)
                .createdAt(user.getCreatedAt())
                .message("로그인 성공")
                .build();
    }
}

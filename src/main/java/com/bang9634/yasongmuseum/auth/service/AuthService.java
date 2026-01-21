package com.bang9634.yasongmuseum.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.auth.dto.AuthResponse;
import com.bang9634.yasongmuseum.auth.dto.LoginRequest;
import com.bang9634.yasongmuseum.auth.dto.SignupRequest;
import com.bang9634.yasongmuseum.common.exception.DuplicateEmailException;
import com.bang9634.yasongmuseum.common.exception.DuplicateUsernameException;
import com.bang9634.yasongmuseum.common.exception.InvalidPasswordException;
import com.bang9634.yasongmuseum.common.exception.UserNotFoundException;
import com.bang9634.yasongmuseum.common.security.JwtTokenProvider;
import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Authentication Service
 * Handles user signup and login logic.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final LoginLogService loginLogService;

    public AuthResponse signup(SignupRequest request) {
        log.info("Attempting to sign up user: {}", request.getUsername());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUsernameException("이미 사용 중인 아이디입니다.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());

        User savedUser = userRepository.save(user);

        log.info("User signed up successfully: {}", savedUser.getUsername());
        return AuthResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole())
                .createdAt(savedUser.getCreatedAt())
                .message("회원가입이 완료되었습니다.")
                .build();
    }


    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        try {
            log.info("Attempting to log in user: {}", request.getUsername());
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> {
                        return new UserNotFoundException("사용자를 찾을 수 없습니다.");
            });
            
            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
            }

            loginLogService.logSuccessfulLogin(user, httpRequest);

            String token = jwtTokenProvider.createToken(
                user.getUsername(), 
                user.getId(),
                user.getRole()
            );
            
            log.info("User logged in successfully: {}", user.getUsername());
            return AuthResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .name(user.getName())
                    .role(user.getRole())
                    .token(token)
                    .createdAt(user.getCreatedAt())
                    .message("로그인 성공")
                    .build();
        } catch (UserNotFoundException e) {
            loginLogService.logFailedLogin(
                request.getUsername(), 
                "User not found", 
                httpRequest
            );
            throw e;
        } catch (InvalidPasswordException e) {
            loginLogService.logFailedLogin(
                request.getUsername(), 
                "Invalid password", 
                httpRequest
            );
            throw e;
        } catch (Exception e) {
            loginLogService.logFailedLogin(
                request.getUsername(), 
                "Unexpected system error: " + e.getMessage(), 
                httpRequest
            );
            throw e;
        }
    }
}

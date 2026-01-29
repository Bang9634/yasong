package com.bang9634.yasongmuseum.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.auth.dto.AuthResponse;
import com.bang9634.yasongmuseum.auth.dto.LoginRequest;
import com.bang9634.yasongmuseum.auth.dto.SignupRequest;
import com.bang9634.yasongmuseum.auth.exception.TooManyLoginAttemptsException;
import com.bang9634.yasongmuseum.common.security.JwtTokenProvider;
import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.exception.DuplicateEmailException;
import com.bang9634.yasongmuseum.user.exception.DuplicateUsernameException;
import com.bang9634.yasongmuseum.user.exception.InvalidPasswordException;
import com.bang9634.yasongmuseum.user.exception.UserNotFoundException;
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
    private final LoginAttemptService loginAttemptService;

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
        String ipAddress = getClientIp(httpRequest);
        String username = request.getUsername();
        
        // Check if IP is blocked
        if (loginAttemptService.isIpBlocked(ipAddress)) {
            int remainingTime = loginAttemptService.getRemainingBlockTime(ipAddress, true);
            log.warn("Login blocked - too many attempts from IP: {}", ipAddress);
            throw new TooManyLoginAttemptsException(
                String.format("너무 많은 로그인 시도로 인해 차단되었습니다. %d분 후 다시 시도해주세요.", remainingTime),
                remainingTime
            );
        }
        
        // Check if username is blocked
        if (loginAttemptService.isUsernameBlocked(username)) {
            int remainingTime = loginAttemptService.getRemainingBlockTime(username, false);
            log.warn("Login blocked - too many attempts for username: {}", username);
            throw new TooManyLoginAttemptsException(
                String.format("해당 계정은 너무 많은 로그인 시도로 인해 일시적으로 차단되었습니다. %d분 후 다시 시도해주세요.", remainingTime),
                remainingTime
            );
        }
        
        try {
            log.info("Attempting to log in user: {} from IP: {}", username, ipAddress);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        return new UserNotFoundException("사용자를 찾을 수 없습니다.");
            });
            
            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
            }

            // Login succeeded - clear attempts
            loginAttemptService.loginSucceeded(ipAddress, username);
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
            loginAttemptService.loginFailed(ipAddress, username);
            loginLogService.logFailedLogin(
                username, 
                "User not found", 
                httpRequest
            );
            throw e;
        } catch (InvalidPasswordException e) {
            loginAttemptService.loginFailed(ipAddress, username);
            loginLogService.logFailedLogin(
                username, 
                "Invalid password", 
                httpRequest
            );
            throw e;
        } catch (Exception e) {
            loginLogService.logFailedLogin(
                username, 
                "Unexpected system error: " + e.getMessage(), 
                httpRequest
            );
            throw e;
        }
    }
    
    /**
     * Extract real client IP address from request
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_CLUSTER_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_FORWARDED");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_VIA");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // Handle multiple IPs (take the first one)
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
}

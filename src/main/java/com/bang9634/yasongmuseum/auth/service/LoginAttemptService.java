package com.bang9634.yasongmuseum.auth.service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.bang9634.yasongmuseum.auth.repository.LoginLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for tracking and preventing brute-force login attempts.
 * Implements IP-based and account-based rate limiting.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class LoginAttemptService {
    
    private static final int MAX_ATTEMPTS = 5;
    private static final int BLOCK_DURATION_MINUTES = 15;
    
    private final LoginLogRepository loginLogRepository;
    
    // IP Address -> Login Attempt Info
    private final ConcurrentMap<String, LoginAttempt> ipAttempts = new ConcurrentHashMap<>();
    
    // Username -> Login Attempt Info
    private final ConcurrentMap<String, LoginAttempt> usernameAttempts = new ConcurrentHashMap<>();
    
    /**
     * Check if IP is blocked due to too many failed attempts
     */
    public boolean isIpBlocked(String ipAddress) {
        LoginAttempt attempt = ipAttempts.get(ipAddress);
        if (attempt == null) {
            return false;
        }
        
        if (attempt.isExpired()) {
            ipAttempts.remove(ipAddress);
            return false;
        }
        
        return attempt.getAttemptCount() >= MAX_ATTEMPTS;
    }
    
    /**
     * Check if username is blocked due to too many failed attempts
     */
    public boolean isUsernameBlocked(String username) {
        LoginAttempt attempt = usernameAttempts.get(username);
        if (attempt == null) {
            return false;
        }
        
        if (attempt.isExpired()) {
            usernameAttempts.remove(username);
            return false;
        }
        
        return attempt.getAttemptCount() >= MAX_ATTEMPTS;
    }
    
    /**
     * Record a failed login attempt
     */
    public void loginFailed(String ipAddress, String username) {
        // Track by IP
        ipAttempts.compute(ipAddress, (key, attempt) -> {
            if (attempt == null || attempt.isExpired()) {
                return new LoginAttempt(1);
            }
            attempt.incrementAttempt();
            return attempt;
        });
        
        // Track by username
        usernameAttempts.compute(username, (key, attempt) -> {
            if (attempt == null || attempt.isExpired()) {
                return new LoginAttempt(1);
            }
            attempt.incrementAttempt();
            return attempt;
        });
        
        log.warn("Failed login attempt - IP: {}, Username: {}, IP Attempts: {}, Username Attempts: {}", 
            ipAddress, username, 
            ipAttempts.get(ipAddress).getAttemptCount(),
            usernameAttempts.get(username).getAttemptCount());
    }
    
    /**
     * Clear attempts on successful login
     */
    public void loginSucceeded(String ipAddress, String username) {
        ipAttempts.remove(ipAddress);
        usernameAttempts.remove(username);
        log.info("Login succeeded - cleared attempts for IP: {}, Username: {}", ipAddress, username);
    }
    
    /**
     * Get remaining time in minutes for blocked IP/username
     */
    public int getRemainingBlockTime(String key, boolean isIp) {
        LoginAttempt attempt = isIp ? ipAttempts.get(key) : usernameAttempts.get(key);
        if (attempt == null || attempt.isExpired()) {
            return 0;
        }
        
        long minutesElapsed = java.time.Duration.between(
            attempt.getFirstAttemptTime(), 
            LocalDateTime.now()
        ).toMinutes();
        
        return (int) Math.max(0, BLOCK_DURATION_MINUTES - minutesElapsed);
    }
    
    /**
     * Inner class to track login attempts
     */
    private static class LoginAttempt {
        private int attemptCount;
        private final LocalDateTime firstAttemptTime;
        
        public LoginAttempt(int count) {
            this.attemptCount = count;
            this.firstAttemptTime = LocalDateTime.now();
        }
        
        public void incrementAttempt() {
            this.attemptCount++;
        }
        
        public int getAttemptCount() {
            return attemptCount;
        }
        
        public LocalDateTime getFirstAttemptTime() {
            return firstAttemptTime;
        }
        
        public boolean isExpired() {
            return LocalDateTime.now().isAfter(
                firstAttemptTime.plusMinutes(BLOCK_DURATION_MINUTES)
            );
        }
    }
}

package com.bang9634.yasongmuseum.auth.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.auth.entity.LoginLog;
import com.bang9634.yasongmuseum.auth.repository.LoginLogRepository;
import com.bang9634.yasongmuseum.user.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for logging user login attempts.
 * Handles both successful and failed login attempts,
 * capturing details such as IP address, device type, browser, and OS.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LoginLogService {
    
    private final LoginLogRepository loginLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logSuccessfulLogin(User user, HttpServletRequest request) {
        LoginLog loginLog = LoginLog.builder()
            .userId(user.getId())
            .username(user.getUsername())
            .loginStatus(LoginLog.LoginStatus.SUCCESS)
            .loginTime(LocalDateTime.now())
            .ipAddress(getClientIp(request))
            .deviceType(detectDeviceType(request))
            .browser(detectBrowser(request))
            .os(detectOS(request))
            .build();
        
        loginLogRepository.save(loginLog);
        log.info("Logged successful login for username: {}", user.getUsername());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logFailedLogin(String username, String reason, HttpServletRequest request) {
        LoginLog loginLog = LoginLog.builder()
            .userId(null)
            .username(username)
            .loginStatus(LoginLog.LoginStatus.FAILURE)
            .loginTime(LocalDateTime.now())
            .ipAddress(getClientIp(request))
            .deviceType(detectDeviceType(request))
            .browser(detectBrowser(request))
            .os(detectOS(request))
            .failureReason(reason)
            .build();

        loginLogRepository.save(loginLog);
        log.info("Logged failed login for username: {}. Reason: {}", username, reason);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

        private String detectDeviceType(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null) return "UNKNOWN";
        
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("mobile") || userAgent.contains("android") || userAgent.contains("iphone")) {
            return "MOBILE";
        } else if (userAgent.contains("tablet") || userAgent.contains("ipad")) {
            return "TABLET";
        }
        return "DESKTOP";
    }

    private String detectBrowser(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null) return "Unknown";
        
        if (userAgent.contains("Edg/")) return "Edge";
        if (userAgent.contains("Chrome/")) return "Chrome";
        if (userAgent.contains("Safari/") && !userAgent.contains("Chrome")) return "Safari";
        if (userAgent.contains("Firefox/")) return "Firefox";
        
        return "Other";
    }

        private String detectOS(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent == null) return "Unknown";
        
        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Mac OS")) return "macOS";
        if (userAgent.contains("Linux")) return "Linux";
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iOS") || userAgent.contains("iPhone")) return "iOS";
        
        return "Other";
    }
}

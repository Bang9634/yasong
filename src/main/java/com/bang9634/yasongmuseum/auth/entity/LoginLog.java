package com.bang9634.yasongmuseum.auth.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a log of user login attempts.
 * Captures details such as IP address, device type, browser, OS,
 * login time, status (success/failure), and failure reason if applicable.
 * 
 * @apiNote This entity is used for auditing and security monitoring purposes.
 *          also, field of userId can be null in case of failed login attempts.
 */
@Entity
@Table(name = "login_logs")
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Can be null for failed login attempts
    @Column(name = "user_id", nullable = true)
    private Long userId;

    @Column(name = "ip_address", nullable = false, length = 45)
    private String ipAddress;

    @Column(nullable = false, length = 50) 
    private String username;

    @Column(name = "device_type", length = 20)
    private String deviceType;

    @Column(length = 100)
    private String browser;

    @Column(length = 100)
    private String os;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "login_status", nullable = false, length = 20)
    private LoginStatus loginStatus;

    @Column(name = "failure_reason", length = 255)
    private String failureReason;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (loginTime == null) {
            loginTime = LocalDateTime.now();
        }
    }

    public enum LoginStatus {
        SUCCESS,
        FAILURE
    }
}

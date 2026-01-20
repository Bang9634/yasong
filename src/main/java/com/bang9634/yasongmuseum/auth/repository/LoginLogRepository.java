package com.bang9634.yasongmuseum.auth.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bang9634.yasongmuseum.auth.entity.LoginLog;

public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {
    
    // Login logs for a specific user
    Page<LoginLog> findByUserIdOrderByLoginTimeDesc(Long userId, Pageable pageable);

    List<LoginLog> findByIpAddressAndLoginStatusAndLoginTimeAfter(String ipAddress, LoginLog.LoginStatus loginStatus, LocalDateTime after);

    @Query("SELECT l FROM LoginLog l WHERE l.ipAddress = :ipAddress " +
           "AND l.loginTime > :since ORDER BY l.loginTime DESC")
    List<LoginLog> findRecentByIpAddress(String ipAddress, LocalDateTime since);
}

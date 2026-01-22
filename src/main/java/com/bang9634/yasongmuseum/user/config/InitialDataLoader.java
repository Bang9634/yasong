package com.bang9634.yasongmuseum.user.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.entity.UserRole;
import com.bang9634.yasongmuseum.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class InitialDataLoader implements ApplicationRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createDefaultAdmin();
    }

    private void createDefaultAdmin() {
        boolean AdminExists = userRepository.existsByRole(UserRole.ADMIN);

        if (!AdminExists) {
            log.info("There is no admin. Creating default admin...");

            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setName("관리자");
            admin.setRole(UserRole.ADMIN);
            
            userRepository.save(admin);

            log.info("Created deafult admin successfully");
            log.info("Change default password");
        } else {
            log.info("");
        }
    }
}

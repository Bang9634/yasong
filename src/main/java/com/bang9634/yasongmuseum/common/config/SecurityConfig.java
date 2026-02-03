package com.bang9634.yasongmuseum.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.bang9634.yasongmuseum.common.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/**
 * Security Configuration
 * Configures security settings including JWT authentication and password encoding.
 * 
 * @apiNote This configuration sets up stateless session management,
 *          permits unauthenticated access to authentication endpoints,
 *          and secures other API endpoints.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
            // Public endpoints
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // permit all OPTIONS requests
            .requestMatchers("/", "/index.html").permitAll() // permit root and index.html for SPA
            .requestMatchers("/static/**", "/assets/**", "/*.js", "/*.css", "/*.ico", "/*.png", "/*.jpg", "/*.svg").permitAll() // permit static resources
            
            // Admin-only auth endpoints (MUST be before /api/auth/**)
            .requestMatchers("/api/auth/signup").hasRole("ADMIN") // restrict signup to ADMIN role
            
            // Public auth endpoints
            .requestMatchers("/api/auth/**").permitAll() // permit other auth APIs without authentication
            
            // Public file and content endpoints
            .requestMatchers("/api/files/**").permitAll() // permit file downloads
            .requestMatchers("/api/notices/**").permitAll() // permit public notice fetching
            .requestMatchers("/api/website/settings/**").permitAll() // permit public website settings fetching
            .requestMatchers("/api/collections/**").permitAll() // permit public collections fetching
            .requestMatchers("/api/exhibitions/**").permitAll() // permit public exhibitions fetching
            .requestMatchers("/api/contests/**").permitAll() // permit public contests fetching
            .requestMatchers("/uploads/**").permitAll() // permit uploaded files access

            // Admin and Manager endpoints
            .requestMatchers("/api/management/**").hasAnyRole("ADMIN","MANAGER")

            // Admin endpoints
            .requestMatchers("/api/admin/**").hasRole("ADMIN") // restrict admin APIs to ADMIN role

            // API 경로만 인증 필요, 나머지는 허용 (SPA 라우팅)
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll() // permit all non-API requests for SPA routing
        )
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // no session will be created or used by spring security
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .csrf(csrf -> csrf.disable()); // disable CSRF for stateless APIs

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

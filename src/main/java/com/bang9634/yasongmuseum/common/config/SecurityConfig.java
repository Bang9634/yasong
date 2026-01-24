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
            .requestMatchers("/api/auth/**").permitAll() // permit auth APIs without authentication
            .requestMatchers("/api/notices/**").permitAll() // permit public notice fetching
            .requestMatchers("/api/website/settings/**").permitAll() // permit public website settings fetching
            .requestMatchers("/api/collections/**").permitAll() // permit public collections fetching
            .requestMatchers("/api/exhibitions/**").permitAll() // permit public exhibitions fetching
            .requestMatchers("/api/souvenirs/**").permitAll() // permit public souvenirs fetching
            .requestMatchers("/uploads/**").permitAll() // permit uploaded files access

            // Admin and Manager endpoints
            .requestMatchers("/api/management/**").hasAnyRole("ADMIN","MANAGER")

            // Admin endpoints
            .requestMatchers("/api/admin/**").hasRole("ADMIN") // restrict admin APIs to ADMIN role

            .anyRequest().authenticated() // authenticate other API requests
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

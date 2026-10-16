package com.bang9634.yasongmuseum.auth.controller;

import com.bang9634.yasongmuseum.auth.dto.AuthResponse;
import com.bang9634.yasongmuseum.auth.dto.LoginRequest;
import com.bang9634.yasongmuseum.auth.dto.SignupRequest;
import com.bang9634.yasongmuseum.auth.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller
 * Handles user signup and login requests.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Signup API
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Login API
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request, 
            HttpServletRequest httpRequest) {
                
        AuthResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Test endpoint
     * GET /api/auth/test
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth API is working");
    }
}
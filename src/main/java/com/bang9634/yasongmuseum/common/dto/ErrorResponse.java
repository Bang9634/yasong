package com.bang9634.yasongmuseum.common.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Error Response DTO
 * Used to standardize error responses across the application.
 * Includes HTTP status, error message, request path, and timestamp.
 * 
 * @apiNote This DTO is typically used in exception handling mechanisms
 *         to provide consistent error information to API clients.
 * 
 * @see com.bang9634.yasongmuseum.common.exception.GlobalExceptionHandler
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    private LocalDateTime timestamp;
}

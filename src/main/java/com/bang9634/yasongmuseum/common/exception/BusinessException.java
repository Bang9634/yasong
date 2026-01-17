package com.bang9634.yasongmuseum.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

/**
 * Base class for business exceptions in the application.
 * Includes an HTTP status code for appropriate error handling.
 */
@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus status;

    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}

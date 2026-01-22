package com.bang9634.yasongmuseum.user.exception;

import org.springframework.http.HttpStatus;

import com.bang9634.yasongmuseum.common.exception.BusinessException;

public class InvalidPasswordException extends BusinessException {
    public InvalidPasswordException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

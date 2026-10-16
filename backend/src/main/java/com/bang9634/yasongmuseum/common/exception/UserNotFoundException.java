package com.bang9634.yasongmuseum.common.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends BusinessException{
    public UserNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

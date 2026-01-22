package com.bang9634.yasongmuseum.user.exception;

import org.springframework.http.HttpStatus;

import com.bang9634.yasongmuseum.common.exception.BusinessException;

public class UserNotFoundException extends BusinessException{
    public UserNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

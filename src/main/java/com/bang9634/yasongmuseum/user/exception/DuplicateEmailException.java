package com.bang9634.yasongmuseum.user.exception;

import org.springframework.http.HttpStatus;

import com.bang9634.yasongmuseum.common.exception.BusinessException;

public class DuplicateEmailException extends BusinessException{
    public DuplicateEmailException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}

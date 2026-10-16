package com.bang9634.yasongmuseum.common.exception;

import org.springframework.http.HttpStatus;

public class DuplicateEmailException extends BusinessException{
    public DuplicateEmailException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}

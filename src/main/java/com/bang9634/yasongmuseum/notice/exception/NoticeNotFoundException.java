package com.bang9634.yasongmuseum.notice.exception;

import org.springframework.http.HttpStatus;

import com.bang9634.yasongmuseum.common.exception.BusinessException;

public class NoticeNotFoundException extends BusinessException {
    public NoticeNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}

package com.bang9634.yasongmuseum.website.exception;

import com.bang9634.yasongmuseum.common.exception.BusinessException;
import org.springframework.http.HttpStatus;

public class FileUploadException extends BusinessException {

    public FileUploadException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public FileUploadException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

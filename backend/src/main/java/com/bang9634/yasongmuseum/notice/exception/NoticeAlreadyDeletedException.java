package com.bang9634.yasongmuseum.notice.exception;

import com.bang9634.yasongmuseum.common.exception.BusinessException;

public class NoticeAlreadyDeletedException extends BusinessException {
    public NoticeAlreadyDeletedException(String message) {
        super(message);
    }
}

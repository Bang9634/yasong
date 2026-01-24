package com.bang9634.yasongmuseum.souvenir.exception;

import com.bang9634.yasongmuseum.common.exception.BusinessException;

public class SouvenirNotFoundException extends BusinessException {
    
    public SouvenirNotFoundException(Long id) {
        super("기념품을 찾을 수 없습니다. ID: " + id);
    }
}

package com.bang9634.yasongmuseum.exhibition.exception;

import com.bang9634.yasongmuseum.common.exception.BusinessException;
import org.springframework.http.HttpStatus;

public class ExhibitionNotFoundException extends BusinessException {

    public ExhibitionNotFoundException(Long id) {
        super("전시를 찾을 수 없습니다: " + id, HttpStatus.NOT_FOUND);
    }
}

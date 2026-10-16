package com.bang9634.yasongmuseum.collection.exception;

import com.bang9634.yasongmuseum.common.exception.BusinessException;
import org.springframework.http.HttpStatus;

public class CollectionNotFoundException extends BusinessException {

    public CollectionNotFoundException(Long id) {
        super("컬렉션을 찾을 수 없습니다: " + id, HttpStatus.NOT_FOUND);
    }
}

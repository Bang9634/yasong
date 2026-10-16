package com.bang9634.yasongmuseum.website.exception;

import com.bang9634.yasongmuseum.common.exception.BusinessException;
import org.springframework.http.HttpStatus;

public class SettingNotFoundException extends BusinessException {

    public SettingNotFoundException(String settingKey) {
        super("설정을 찾을 수 없습니다: " + settingKey, HttpStatus.NOT_FOUND);
    }
}

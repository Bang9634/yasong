package com.bang9634.yasongmuseum.legal.entity;

import lombok.Getter;

/**
 * Term Type Enum
 * Distinguishes between Terms of Service and Privacy Policy
 */
@Getter
public enum TermType {
    TERMS_OF_SERVICE("이용약관"),
    PRIVACY_POLICY("개인정보 처리방침");

    private final String description;

    TermType(String description) {
        this.description = description;
    }
}

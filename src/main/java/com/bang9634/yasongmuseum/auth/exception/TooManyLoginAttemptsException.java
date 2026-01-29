package com.bang9634.yasongmuseum.auth.exception;

/**
 * Exception thrown when too many login attempts are detected
 */
public class TooManyLoginAttemptsException extends RuntimeException {
    
    private final int remainingMinutes;
    
    public TooManyLoginAttemptsException(String message, int remainingMinutes) {
        super(message);
        this.remainingMinutes = remainingMinutes;
    }
    
    public int getRemainingMinutes() {
        return remainingMinutes;
    }
}

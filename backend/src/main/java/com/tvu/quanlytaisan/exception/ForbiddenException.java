package com.tvu.quanlytaisan.exception;

/**
 * Exception khi không có quyền truy cập
 * HTTP Status: 403 Forbidden
 */
public class ForbiddenException extends RuntimeException {
    
    public ForbiddenException(String message) {
        super(message);
    }
}

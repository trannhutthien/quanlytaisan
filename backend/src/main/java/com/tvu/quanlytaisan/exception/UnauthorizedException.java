package com.tvu.quanlytaisan.exception;

/**
 * Exception khi chưa đăng nhập hoặc token không hợp lệ
 * HTTP Status: 401 Unauthorized
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
}

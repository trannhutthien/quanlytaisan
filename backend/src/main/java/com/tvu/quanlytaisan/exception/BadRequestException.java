package com.tvu.quanlytaisan.exception;

/**
 * Exception khi request không hợp lệ
 * HTTP Status: 400 Bad Request
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
}

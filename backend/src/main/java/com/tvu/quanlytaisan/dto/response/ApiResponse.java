package com.tvu.quanlytaisan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Format response chung cho tất cả API
 * Đảm bảo mọi response đều có cấu trúc thống nhất
 * 
 * @param <T> Kiểu dữ liệu của data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    /**
     * Trạng thái thành công hay thất bại
     */
    private boolean success;
    
    /**
     * Thông báo cho người dùng
     */
    private String message;
    
    /**
     * Dữ liệu trả về (nếu có)
     */
    private T data;
    
    /**
     * Thời gian response
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    // ============ Static Factory Methods ============
    
    /**
     * Tạo response thành công với data
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Thành công")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Tạo response thành công với message và data
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Tạo response thành công chỉ có message
     */
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Tạo response lỗi với message
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Tạo response lỗi với message và data (thường là error details)
     */
    public static <T> ApiResponse<T> error(String message, T data) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
}

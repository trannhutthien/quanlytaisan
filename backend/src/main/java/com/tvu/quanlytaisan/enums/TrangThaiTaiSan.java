package com.tvu.quanlytaisan.enums;

/**
 * Enum định nghĩa các trạng thái của tài sản
 */
public enum TrangThaiTaiSan {
    /**
     * Đang được sử dụng
     */
    IN_USE("Đang sử dụng"),
    
    /**
     * Còn trống, sẵn sàng sử dụng
     */
    AVAILABLE("Còn trống"),
    
    /**
     * Đang bảo trì hoặc sửa chữa
     */
    MAINTENANCE("Đang bảo trì"),
    
    /**
     * Hư hỏng, không sử dụng được
     */
    BROKEN("Hư hỏng");
    
    private final String moTa;
    
    TrangThaiTaiSan(String moTa) {
        this.moTa = moTa;
    }
    
    public String getMoTa() {
        return moTa;
    }
}

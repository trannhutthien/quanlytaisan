package com.tvu.quanlytaisan.enums;

/**
 * Enum định nghĩa vai trò người dùng trong hệ thống
 */
public enum VaiTro {
    /**
     * Quản trị viên - có toàn quyền
     */
    ADMIN("Quản trị viên"),
    
    /**
     * Người dùng thông thường - quyền hạn chế
     */
    USER("Người dùng");
    
    private final String moTa;
    
    VaiTro(String moTa) {
        this.moTa = moTa;
    }
    
    public String getMoTa() {
        return moTa;
    }
}

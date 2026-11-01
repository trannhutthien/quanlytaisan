package com.tvu.quanlytaisan.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String tendangnhap;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    private String matkhau;
}

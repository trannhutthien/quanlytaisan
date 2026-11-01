package com.tvu.quanlytaisan.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoaiTaiSanRequest {
    
    @NotBlank(message = "Tên loại tài sản không được để trống")
    @Size(max = 100, message = "Tên loại tài sản không được quá 100 ký tự")
    private String tenloai;
}

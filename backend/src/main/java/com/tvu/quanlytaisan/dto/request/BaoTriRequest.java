package com.tvu.quanlytaisan.dto.request;

import com.tvu.quanlytaisan.enums.LoaiBaoTri;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaoTriRequest {
    
    @NotNull(message = "Tài sản không được để trống")
    private Long taisanId;
    
    @NotNull(message = "Loại bảo trì không được để trống")
    private LoaiBaoTri loaibaotri;
    
    @NotNull(message = "Ngày báo không được để trống")
    private LocalDate ngaybao;
    
    private String motahuhong;
    
    private BigDecimal chiphi;
    
    private String ketqua;
    
    private LocalDate ngayhoanthanh;
    
    private LocalDate ngaybaotritieptheo;
}

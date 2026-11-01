package com.tvu.quanlytaisan.dto.request;

import com.tvu.quanlytaisan.enums.TrangThaiXuLy;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaoTriUpdateRequest {
    
    @NotNull(message = "Trạng thái xử lý không được để trống")
    private TrangThaiXuLy trangthaixuly;
    
    private BigDecimal chiphi;
    
    private String ketqua;
    
    private LocalDate ngayhoanthanh;
    
    private LocalDate ngaybaotritieptheo;
}

package com.tvu.quanlytaisan.dto.response;

import com.tvu.quanlytaisan.enums.LoaiBaoTri;
import com.tvu.quanlytaisan.enums.TrangThaiXuLy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaoTriResponse {
    
    private Long baotriId;
    
    // Thong tin tai san
    private Long taisanId;
    private String mataisan;
    private String tentaisan;
    
    private LoaiBaoTri loaibaotri;
    
    // Thong tin nguoi bao
    private Long nguoibaoId;
    private String hotennguoibao;
    
    private LocalDate ngaybao;
    private String motahuhong;
    
    private TrangThaiXuLy trangthaixuly;
    
    private LocalDate ngayhoanthanh;
    private BigDecimal chiphi;
    private String ketqua;
    private LocalDate ngaybaotritieptheo;
}

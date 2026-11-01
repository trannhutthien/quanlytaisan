package com.tvu.quanlytaisan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaoTriThongKeResponse {
    
    private Integer tongSoPhieu;
    private Integer soPhieuChoXuLy;
    private Integer soPhieuDangXuLy;
    private Integer soPhieuHoanThanh;
    private Integer soPhieuDaHuy;
    
    private BigDecimal tongChiPhi;
    private BigDecimal chiPhiThang;
    private BigDecimal chiPhiNam;
}

package com.tvu.quanlytaisan.dto.response;

import com.tvu.quanlytaisan.enums.TrangThaiDotKiemKe;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DotKiemKeResponse {
    private Long dotkiemkeId;
    private String tendot;
    private Integer donviId;
    private String tendonvi;
    private LocalDate ngaybatdau;
    private TrangThaiDotKiemKe trangthai;
    
    // Thống kê
    private Long tongTaiSan;
    private Long daKiem;
    private Long chuaKiem;
    private Long coMatDungViTri;
    private Long coMatLechViTri;
    private Long thieu;
}

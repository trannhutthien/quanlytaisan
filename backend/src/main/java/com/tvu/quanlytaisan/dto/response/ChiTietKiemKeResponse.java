package com.tvu.quanlytaisan.dto.response;

import com.tvu.quanlytaisan.enums.KetQuaKiemKe;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChiTietKiemKeResponse {
    private Long chitietkiemkeId;
    private Long dotkiemkeId;
    
    // Thông tin tài sản
    private Long taisanId;
    private String mataisan;
    private String tentaisan;
    private String tenloai;
    
    // Vị trí đăng ký
    private Integer vitriId;
    private String tenvitri;
    private String tendonvi;
    
    // Kết quả kiểm kê
    private KetQuaKiemKe ketqua;
    private Integer vitrithucteId;
    private String tenvitrithucte;
    private String tendonvithucte;
    
    // Người kiểm
    private Long nguoidungId;
    private String hotennguoikiem;
    private LocalDateTime thoigiankiem;
}

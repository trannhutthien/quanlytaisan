package com.tvu.quanlytaisan.dto.request;

import com.tvu.quanlytaisan.enums.KetQuaKiemKe;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KiemKeRequest {
    private Long dotkiemkeId;
    private Long taisanId;
    private KetQuaKiemKe ketqua;
    private Integer vitrithucteId;
}

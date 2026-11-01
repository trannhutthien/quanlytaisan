package com.tvu.quanlytaisan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DotKiemKeRequest {
    private String tendot;
    private Integer donviId;
    private LocalDate ngaybatdau;
}

package com.tvu.quanlytaisan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonViRequest {
    private String madonvi;
    private String tendonvi;
    private Integer donvichaId;
}

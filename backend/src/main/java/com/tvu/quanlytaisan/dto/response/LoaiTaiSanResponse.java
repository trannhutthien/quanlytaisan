package com.tvu.quanlytaisan.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoaiTaiSanResponse {
    
    private Integer loaitaisanId;
    private String tenloai;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

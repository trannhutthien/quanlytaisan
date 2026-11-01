package com.tvu.quanlytaisan.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViTriRequest {
    private String mavitri;
    private String tenvitri;
    private Integer donviId;
}

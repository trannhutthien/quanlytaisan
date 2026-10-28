package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "trangthaitaisan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrangThaiTaiSan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trangthaitaisan_id")
    private Integer trangthaitaisanId;
    
    @Column(name = "matrangthai", length = 20, nullable = false, unique = true)
    private String matrangthai;
    
    @Column(name = "tentrangthai", length = 50, nullable = false)
    private String tentrangthai;
}

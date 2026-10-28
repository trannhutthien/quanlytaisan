package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loaitaisan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoaiTaiSan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loaitaisan_id")
    private Integer loaitaisanId;
    
    @Column(name = "tenloai", length = 100, nullable = false, unique = true)
    private String tenloai;
}

package com.tvu.quanlytaisan.entity;

import com.tvu.quanlytaisan.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loaitaisan")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class LoaiTaiSan extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loaitaisan_id")
    private Integer loaitaisanId;
    
    @Column(name = "tenloai", length = 100, nullable = false, unique = true)
    private String tenloai;
}

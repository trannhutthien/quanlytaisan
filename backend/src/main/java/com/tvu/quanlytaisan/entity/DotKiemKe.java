package com.tvu.quanlytaisan.entity;

import com.tvu.quanlytaisan.entity.base.BaseEntity;
import com.tvu.quanlytaisan.enums.TrangThaiDotKiemKe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "dotkiemke")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class DotKiemKe extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dotkiemke_id")
    private Long dotkiemkeId;
    
    @Column(name = "tendot", length = 150, nullable = false)
    private String tendot;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donvi_id")
    private DonVi donvi;
    
    @Column(name = "ngaybatdau", nullable = false)
    private LocalDate ngaybatdau;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai", nullable = false)
    private TrangThaiDotKiemKe trangthai = TrangThaiDotKiemKe.DANGMO;
}

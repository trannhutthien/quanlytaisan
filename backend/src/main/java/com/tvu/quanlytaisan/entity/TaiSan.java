package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "taisan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaiSan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "taisan_id")
    private Long taisanId;
    
    @Column(name = "mataisan", length = 50, nullable = false, unique = true)
    private String mataisan;
    
    @Column(name = "tentaisan", length = 200, nullable = false)
    private String tentaisan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loaitaisan_id", nullable = false)
    private LoaiTaiSan loaitaisan;
    
    @Column(name = "thongsokythuat", columnDefinition = "TEXT")
    private String thongsokythuat;
    
    @Column(name = "ngaynhap", nullable = false)
    private LocalDate ngaynhap;
    
    @Column(name = "giatri", precision = 15, scale = 2, nullable = false)
    private BigDecimal giatri = BigDecimal.ZERO;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vitri_id")
    private ViTri vitri;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trangthaitaisan_id", nullable = false)
    private TrangThaiTaiSan trangthaitaisan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoisudung_id")
    private NguoiDung nguoisudung;
    
    @Column(name = "daxoa", nullable = false)
    private Boolean daxoa = false;
    
    @Column(name = "ngaytao", nullable = false, updatable = false)
    private LocalDateTime ngaytao = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        ngaytao = LocalDateTime.now();
    }
}

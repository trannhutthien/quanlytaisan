package com.tvu.quanlytaisan.entity;

import com.tvu.quanlytaisan.enums.LoaiBaoTri;
import com.tvu.quanlytaisan.enums.TrangThaiXuLy;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "baotri")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaoTri {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "baotri_id")
    private Long baotriId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taisan_id", nullable = false)
    private TaiSan taisan;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "loaibaotri", nullable = false)
    private LoaiBaoTri loaibaotri;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoibao_id")
    private NguoiDung nguoibao;
    
    @Column(name = "ngaybao", nullable = false)
    private LocalDate ngaybao;
    
    @Column(name = "motahuhong", columnDefinition = "TEXT")
    private String motahuhong;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "trangthaixuly", nullable = false)
    private TrangThaiXuLy trangthaixuly = TrangThaiXuLy.CHOXULY;
    
    @Column(name = "ngayhoanthanh")
    private LocalDate ngayhoanthanh;
    
    @Column(name = "chiphi", precision = 15, scale = 2, nullable = false)
    private BigDecimal chiphi = BigDecimal.ZERO;
    
    @Column(name = "ketqua", columnDefinition = "TEXT")
    private String ketqua;
    
    @Column(name = "ngaybaotritieptheo")
    private LocalDate ngaybaotritieptheo;
}

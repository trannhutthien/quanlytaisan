package com.tvu.quanlytaisan.entity;

import com.tvu.quanlytaisan.enums.LoaiPhieu;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "luanchuyen")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LuanChuyen {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "luanchuyen_id")
    private Long luanchuyenId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "loaiphieu", nullable = false)
    private LoaiPhieu loaiphieu;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taisan_id", nullable = false)
    private TaiSan taisan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoigiao_id")
    private NguoiDung nguoigiao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoinhan_id")
    private NguoiDung nguoinhan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vitri_id")
    private ViTri vitri;
    
    @Column(name = "ngaythuchien", nullable = false)
    private LocalDate ngaythuchien;
    
    @Column(name = "lydo", length = 500)
    private String lydo;
}

package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lichsutrangthai")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LichSuTrangThai {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lichsutrangthai_id")
    private Long lichsutrangthaiId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taisan_id", nullable = false)
    private TaiSan taisan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trangthaitaisan_id", nullable = false)
    private TrangThaiTaiSan trangthaitaisan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoidung_id")
    private NguoiDung nguoidung;
    
    @Column(name = "thoigian", nullable = false)
    private LocalDateTime thoigian = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        thoigian = LocalDateTime.now();
    }
}

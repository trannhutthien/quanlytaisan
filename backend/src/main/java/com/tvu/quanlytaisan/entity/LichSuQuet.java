package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "lichsuquet")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LichSuQuet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lichsuquet_id")
    private Long lichsuquetId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taisan_id", nullable = false)
    private TaiSan taisan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoidung_id")
    private NguoiDung nguoidung;
    
    @Column(name = "thoigianquet", nullable = false)
    private LocalDateTime thoigianquet = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        thoigianquet = LocalDateTime.now();
    }
}

package com.tvu.quanlytaisan.entity;

import com.tvu.quanlytaisan.enums.KetQuaKiemKe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chitietkiemke", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"dotkiemke_id", "taisan_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietKiemKe {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chitietkiemke_id")
    private Long chitietkiemkeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dotkiemke_id", nullable = false)
    private DotKiemKe dotkiemke;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taisan_id", nullable = false)
    private TaiSan taisan;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vitrithucte_id")
    private ViTri vitrithucte;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "ketqua", nullable = false)
    private KetQuaKiemKe ketqua = KetQuaKiemKe.CHUAKIEM;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoidung_id")
    private NguoiDung nguoidung;
    
    @Column(name = "thoigiankiem")
    private LocalDateTime thoigiankiem;
}

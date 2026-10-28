package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nguoidung")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDung {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nguoidung_id")
    private Long nguoidungId;
    
    @Column(name = "tendangnhap", length = 50, nullable = false, unique = true)
    private String tendangnhap;
    
    @Column(name = "matkhaumahoa", length = 255, nullable = false)
    private String matkhaumahoa;
    
    @Column(name = "hoten", length = 100, nullable = false)
    private String hoten;
    
    @Column(name = "email", length = 100, unique = true)
    private String email;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vaitro_id", nullable = false)
    private VaiTro vaitro;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donvi_id")
    private DonVi donvi;
    
    @Column(name = "hoatdong", nullable = false)
    private Boolean hoatdong = true;
}

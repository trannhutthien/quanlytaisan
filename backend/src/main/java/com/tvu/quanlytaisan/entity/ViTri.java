package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vitri")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViTri {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vitri_id")
    private Integer vitriId;
    
    @Column(name = "mavitri", length = 30, nullable = false, unique = true)
    private String mavitri;
    
    @Column(name = "tenvitri", length = 150, nullable = false)
    private String tenvitri;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donvi_id", nullable = false)
    private DonVi donvi;
}

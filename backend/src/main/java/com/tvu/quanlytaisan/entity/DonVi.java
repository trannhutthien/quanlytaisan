package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "donvi")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonVi {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donvi_id")
    private Integer donviId;
    
    @Column(name = "madonvi", length = 30, nullable = false, unique = true)
    private String madonvi;
    
    @Column(name = "tendonvi", length = 150, nullable = false)
    private String tendonvi;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donvicha_id")
    private DonVi donviCha;
}

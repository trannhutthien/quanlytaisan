package com.tvu.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vaitro")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VaiTro {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaitro_id")
    private Integer vaitroId;
    
    @Column(name = "mavaitro", length = 20, nullable = false, unique = true)
    private String mavaitro;
    
    @Column(name = "tenvaitro", length = 50, nullable = false)
    private String tenvaitro;
}

package com.tvu.quanlytaisan.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvu.quanlytaisan.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vitri")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ViTri extends BaseEntity {
    
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
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "donviCha"})
    private DonVi donvi;
}

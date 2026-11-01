package com.tvu.quanlytaisan.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tvu.quanlytaisan.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "donvi")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DonVi extends BaseEntity {
    
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
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "donviCha"})
    private DonVi donviCha;
}

package com.tvu.quanlytaisan.entity;

import com.tvu.quanlytaisan.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity test để verify BaseEntity hoạt động
 * Có thể xóa sau khi test xong
 */
@Entity
@Table(name = "test_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestEntity extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "description")
    private String description;
}

package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.LoaiTaiSan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoaiTaiSanRepository extends JpaRepository<LoaiTaiSan, Integer> {
    boolean existsByTenloai(String tenloai);
    boolean existsByTenloaiAndLoaitaisanIdNot(String tenloai, Integer loaitaisanId);
    Optional<LoaiTaiSan> findByTenloai(String tenloai);
}

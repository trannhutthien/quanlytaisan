package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
    Optional<NguoiDung> findByTendangnhap(String tendangnhap);
    boolean existsByTendangnhap(String tendangnhap);
    boolean existsByEmail(String email);
}

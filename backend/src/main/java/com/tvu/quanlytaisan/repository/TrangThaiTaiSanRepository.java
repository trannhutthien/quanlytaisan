package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.TrangThaiTaiSan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrangThaiTaiSanRepository extends JpaRepository<TrangThaiTaiSan, Integer> {
    Optional<TrangThaiTaiSan> findByMatrangthai(String matrangthai);
}

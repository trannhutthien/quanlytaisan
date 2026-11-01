package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.DonVi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonViRepository extends JpaRepository<DonVi, Integer> {
    List<DonVi> findByDonviChaIsNull();
    List<DonVi> findByDonviChaDonviId(Integer donvichaId);
    boolean existsByMadonvi(String madonvi);
    Optional<DonVi> findByMadonvi(String madonvi);
}

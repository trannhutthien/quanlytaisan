package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.ViTri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ViTriRepository extends JpaRepository<ViTri, Integer> {
    List<ViTri> findByDonviDonviId(Integer donviId);
    boolean existsByMavitri(String mavitri);
    Optional<ViTri> findByMavitri(String mavitri);
}

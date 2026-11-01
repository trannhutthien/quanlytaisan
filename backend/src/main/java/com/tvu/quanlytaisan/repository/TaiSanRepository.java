package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.TaiSan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaiSanRepository extends JpaRepository<TaiSan, Long> {
    
    boolean existsByMataisan(String mataisan);
    
    boolean existsByMataisanAndTaisanIdNot(String mataisan, Long taisanId);
    
    Optional<TaiSan> findByMataisan(String mataisan);
    
    // Lay tat ca tai san chua bi xoa
    List<TaiSan> findByDaxoa(boolean daxoa);
    
    List<TaiSan> findByDaxoaFalse();
    
    // Lay tai san theo don vi (qua vi tri)
    @Query("SELECT t FROM TaiSan t WHERE t.daxoa = false AND t.vitri.donvi.donviId = :donviId")
    List<TaiSan> findByViTriDonviDonviId(@Param("donviId") Integer donviId);
    
    // Tim kiem tai san theo ten hoac ma
    @Query("SELECT t FROM TaiSan t WHERE t.daxoa = false AND " +
           "(LOWER(t.tentaisan) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.mataisan) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<TaiSan> searchByKeyword(@Param("keyword") String keyword);
    
    // Lay tai san theo loai
    @Query("SELECT t FROM TaiSan t WHERE t.daxoa = false AND t.loaitaisan.loaitaisanId = :loaitaisanId")
    List<TaiSan> findByLoaiTaiSan(@Param("loaitaisanId") Integer loaitaisanId);
}

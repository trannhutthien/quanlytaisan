package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.ChiTietKiemKe;
import com.tvu.quanlytaisan.enums.KetQuaKiemKe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChiTietKiemKeRepository extends JpaRepository<ChiTietKiemKe, Long> {
    List<ChiTietKiemKe> findByDotkiemkeDotkiemkeId(Long dotkiemkeId);
    
    Optional<ChiTietKiemKe> findByDotkiemkeDotkiemkeIdAndTaisanTaisanId(Long dotkiemkeId, Long taisanId);
    
    Long countByDotkiemkeDotkiemkeId(Long dotkiemkeId);
    
    Long countByDotkiemkeDotkiemkeIdAndKetqua(Long dotkiemkeId, KetQuaKiemKe ketqua);
    
    @Query("SELECT COUNT(c) FROM ChiTietKiemKe c WHERE c.dotkiemke.dotkiemkeId = :dotkiemkeId AND c.ketqua != 'CHUAKIEM'")
    Long countDaKiem(@Param("dotkiemkeId") Long dotkiemkeId);
}

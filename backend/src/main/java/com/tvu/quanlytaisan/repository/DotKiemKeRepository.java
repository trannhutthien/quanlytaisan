package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.DotKiemKe;
import com.tvu.quanlytaisan.enums.TrangThaiDotKiemKe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DotKiemKeRepository extends JpaRepository<DotKiemKe, Long> {
    List<DotKiemKe> findByTrangthaiOrderByNgaybatdauDesc(TrangThaiDotKiemKe trangthai);
    List<DotKiemKe> findAllByOrderByNgaybatdauDesc();
}

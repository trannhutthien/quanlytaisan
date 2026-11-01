package com.tvu.quanlytaisan.repository;

import com.tvu.quanlytaisan.entity.TestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository test cho TestEntity
 * Có thể xóa sau khi test xong
 */
@Repository
public interface TestEntityRepository extends JpaRepository<TestEntity, Long> {
}

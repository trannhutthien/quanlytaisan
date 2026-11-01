package com.tvu.quanlytaisan.controller;

import com.tvu.quanlytaisan.dto.response.ApiResponse;
import com.tvu.quanlytaisan.entity.TestEntity;
import com.tvu.quanlytaisan.exception.BadRequestException;
import com.tvu.quanlytaisan.exception.ResourceNotFoundException;
import com.tvu.quanlytaisan.repository.TestEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller test để verify các enum, BaseEntity, ApiResponse và Exception Handler
 * Có thể xóa sau khi test xong
 */
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {
    
    private final TestEntityRepository testEntityRepository;
    private final com.tvu.quanlytaisan.repository.NguoiDungRepository nguoiDungRepository;
    
    /**
     * Test endpoint đơn giản với ApiResponse
     */
    @GetMapping("/hello")
    public ResponseEntity<ApiResponse<Map<String, Object>>> hello() {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Hello from Backend!");
        data.put("timestamp", LocalDateTime.now());
        data.put("version", "1.0.0");
        
        return ResponseEntity.ok(ApiResponse.success("API đang hoạt động", data));
    }
    
    /**
     * Test ResourceNotFoundException - HTTP 404
     */
    @GetMapping("/error/not-found")
    public ResponseEntity<ApiResponse<Object>> testNotFound() {
        throw new ResourceNotFoundException("Tài sản", "id", "999");
    }
    
    /**
     * Test BadRequestException - HTTP 400
     */
    @GetMapping("/error/bad-request")
    public ResponseEntity<ApiResponse<Object>> testBadRequest() {
        throw new BadRequestException("Dữ liệu không hợp lệ");
    }
    
    /**
     * Test Generic Exception - HTTP 500
     */
    @GetMapping("/error/server")
    public ResponseEntity<ApiResponse<Object>> testServerError() {
        throw new RuntimeException("Lỗi không xác định");
    }
    
    /**
     * Test BaseEntity - Tạo một entity mới
     * createdAt và updatedAt sẽ tự động được set
     */
    @PostMapping("/base-entity")
    public ResponseEntity<ApiResponse<TestEntity>> testBaseEntity(@RequestBody Map<String, String> request) {
        TestEntity entity = new TestEntity();
        entity.setName(request.get("name"));
        entity.setDescription(request.get("description"));
        
        TestEntity saved = testEntityRepository.save(entity);
        
        return ResponseEntity.ok(ApiResponse.success("Tạo thành công", saved));
    }
    
    /**
     * Test lấy entity và xem createdAt/updatedAt
     */
    @GetMapping("/base-entity/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTestEntity(@PathVariable Long id) {
        TestEntity entity = testEntityRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TestEntity", "id", id));
        
        Map<String, Object> data = new HashMap<>();
        data.put("id", entity.getId());
        data.put("name", entity.getName());
        data.put("description", entity.getDescription());
        data.put("createdAt", entity.getCreatedAt());
        data.put("updatedAt", entity.getUpdatedAt());
        
        return ResponseEntity.ok(ApiResponse.success(data));
    }
    
    /**
     * Test update entity - updatedAt sẽ tự động update
     */
    @PutMapping("/base-entity/{id}")
    public ResponseEntity<ApiResponse<TestEntity>> updateTestEntity(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        TestEntity entity = testEntityRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("TestEntity", "id", id));
        
        entity.setName(request.get("name"));
        entity.setDescription(request.get("description"));
        TestEntity updated = testEntityRepository.save(entity);
        
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", updated));
    }
    
    /**
     * Test các enum
     */
    @GetMapping("/enums")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testEnums() {
        Map<String, Object> data = new HashMap<>();
        
        // Test TrangThaiTaiSan enum
        Map<String, String> trangThaiTaiSan = new HashMap<>();
        trangThaiTaiSan.put("IN_USE", com.tvu.quanlytaisan.enums.TrangThaiTaiSan.IN_USE.getMoTa());
        trangThaiTaiSan.put("AVAILABLE", com.tvu.quanlytaisan.enums.TrangThaiTaiSan.AVAILABLE.getMoTa());
        trangThaiTaiSan.put("MAINTENANCE", com.tvu.quanlytaisan.enums.TrangThaiTaiSan.MAINTENANCE.getMoTa());
        trangThaiTaiSan.put("BROKEN", com.tvu.quanlytaisan.enums.TrangThaiTaiSan.BROKEN.getMoTa());
        
        // Test VaiTro enum
        Map<String, String> vaiTro = new HashMap<>();
        vaiTro.put("ADMIN", com.tvu.quanlytaisan.enums.VaiTro.ADMIN.getMoTa());
        vaiTro.put("USER", com.tvu.quanlytaisan.enums.VaiTro.USER.getMoTa());
        
        data.put("trangThaiTaiSan", trangThaiTaiSan);
        data.put("vaiTro", vaiTro);
        
        return ResponseEntity.ok(ApiResponse.success("Enums loaded successfully", data));
    }
    
    /**
     * Test kiểm tra user admin trong database
     */
    @GetMapping("/check-user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkUser() {
        Map<String, Object> data = new HashMap<>();
        try {
            java.util.Optional<com.tvu.quanlytaisan.entity.NguoiDung> user = nguoiDungRepository.findByTendangnhap("admin");
            
            if (user.isPresent()) {
                com.tvu.quanlytaisan.entity.NguoiDung nguoiDung = user.get();
                data.put("found", true);
                data.put("tendangnhap", nguoiDung.getTendangnhap());
                data.put("hoten", nguoiDung.getHoten());
                data.put("vaitro", nguoiDung.getVaitro() != null ? nguoiDung.getVaitro().name() : "NULL");
                data.put("hoatdong", nguoiDung.getHoatdong());
                data.put("matkhau_length", nguoiDung.getMatkhaumahoa() != null ? nguoiDung.getMatkhaumahoa().length() : 0);
                data.put("matkhau_preview", nguoiDung.getMatkhaumahoa() != null ? nguoiDung.getMatkhaumahoa().substring(0, Math.min(10, nguoiDung.getMatkhaumahoa().length())) + "..." : "NULL");
            } else {
                data.put("found", false);
                data.put("message", "User admin không tồn tại trong database");
            }
        } catch (Exception e) {
            data.put("error", true);
            data.put("message", e.getMessage());
            data.put("type", e.getClass().getName());
        }
        
        return ResponseEntity.ok(ApiResponse.success("Check user completed", data));
    }
}

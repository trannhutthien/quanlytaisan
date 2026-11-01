package com.tvu.quanlytaisan.controller;

import com.tvu.quanlytaisan.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/thongke")
@RequiredArgsConstructor
public class ThongKeController {
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        // Temporary mock data - se duoc thay the bang du lieu thuc sau
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAssets", 0);
        stats.put("totalCategories", 0);
        stats.put("totalUsers", 2); // admin + user
        stats.put("assetsInUse", 0);
        stats.put("assetsAvailable", 0);
        stats.put("assetsMaintenance", 0);
        stats.put("assetsBroken", 0);
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

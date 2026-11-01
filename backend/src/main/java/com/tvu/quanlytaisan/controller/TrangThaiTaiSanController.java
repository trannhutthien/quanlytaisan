package com.tvu.quanlytaisan.controller;

import com.tvu.quanlytaisan.dto.response.ApiResponse;
import com.tvu.quanlytaisan.entity.TrangThaiTaiSan;
import com.tvu.quanlytaisan.repository.TrangThaiTaiSanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trang-thai-tai-san")
@RequiredArgsConstructor
public class TrangThaiTaiSanController {
    
    private final TrangThaiTaiSanRepository trangThaiTaiSanRepository;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ApiResponse<List<TrangThaiTaiSan>>> getAllTrangThai() {
        List<TrangThaiTaiSan> trangThais = trangThaiTaiSanRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(trangThais));
    }
}

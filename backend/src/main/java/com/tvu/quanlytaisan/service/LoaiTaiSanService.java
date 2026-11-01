package com.tvu.quanlytaisan.service;

import com.tvu.quanlytaisan.dto.request.LoaiTaiSanRequest;
import com.tvu.quanlytaisan.dto.response.LoaiTaiSanResponse;
import com.tvu.quanlytaisan.entity.LoaiTaiSan;
import com.tvu.quanlytaisan.exception.BadRequestException;
import com.tvu.quanlytaisan.exception.ResourceNotFoundException;
import com.tvu.quanlytaisan.repository.LoaiTaiSanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoaiTaiSanService {
    
    private final LoaiTaiSanRepository loaiTaiSanRepository;
    
    @Transactional(readOnly = true)
    public List<LoaiTaiSanResponse> getAllLoaiTaiSan() {
        return loaiTaiSanRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public LoaiTaiSanResponse getLoaiTaiSanById(Integer id) {
        LoaiTaiSan loaiTaiSan = loaiTaiSanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loại tài sản", "id", id));
        return mapToResponse(loaiTaiSan);
    }
    
    @Transactional
    public LoaiTaiSanResponse createLoaiTaiSan(LoaiTaiSanRequest request) {
        // Kiem tra ten loai da ton tai chua
        if (loaiTaiSanRepository.existsByTenloai(request.getTenloai())) {
            throw new BadRequestException("Tên loại tài sản đã tồn tại: " + request.getTenloai());
        }
        
        LoaiTaiSan loaiTaiSan = new LoaiTaiSan();
        loaiTaiSan.setTenloai(request.getTenloai());
        
        LoaiTaiSan saved = loaiTaiSanRepository.save(loaiTaiSan);
        return mapToResponse(saved);
    }
    
    @Transactional
    public LoaiTaiSanResponse updateLoaiTaiSan(Integer id, LoaiTaiSanRequest request) {
        LoaiTaiSan loaiTaiSan = loaiTaiSanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loại tài sản", "id", id));
        
        // Kiem tra ten loai da ton tai chua (tru chinh no)
        if (loaiTaiSanRepository.existsByTenloaiAndLoaitaisanIdNot(request.getTenloai(), id)) {
            throw new BadRequestException("Tên loại tài sản đã tồn tại: " + request.getTenloai());
        }
        
        loaiTaiSan.setTenloai(request.getTenloai());
        
        LoaiTaiSan updated = loaiTaiSanRepository.save(loaiTaiSan);
        return mapToResponse(updated);
    }
    
    @Transactional
    public void deleteLoaiTaiSan(Integer id) {
        LoaiTaiSan loaiTaiSan = loaiTaiSanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loại tài sản", "id", id));
        
        // TODO: Kiem tra xem co tai san nao dang su dung loai nay khong
        // Neu co, khong cho xoa hoac chuyen sang xoa mem
        
        loaiTaiSanRepository.delete(loaiTaiSan);
    }
    
    private LoaiTaiSanResponse mapToResponse(LoaiTaiSan entity) {
        return LoaiTaiSanResponse.builder()
                .loaitaisanId(entity.getLoaitaisanId())
                .tenloai(entity.getTenloai())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}

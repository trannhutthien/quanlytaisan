package com.tvu.quanlytaisan.service;

import com.tvu.quanlytaisan.dto.request.TaiSanRequest;
import com.tvu.quanlytaisan.dto.response.TaiSanResponse;
import com.tvu.quanlytaisan.entity.*;
import com.tvu.quanlytaisan.exception.BadRequestException;
import com.tvu.quanlytaisan.exception.ResourceNotFoundException;
import com.tvu.quanlytaisan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaiSanService {
    
    private final TaiSanRepository taiSanRepository;
    private final LoaiTaiSanRepository loaiTaiSanRepository;
    private final ViTriRepository viTriRepository;
    private final TrangThaiTaiSanRepository trangThaiTaiSanRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final QRCodeService qrCodeService;
    
    @Transactional(readOnly = true)
    public List<TaiSanResponse> getAllTaiSan() {
        return taiSanRepository.findByDaxoaFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TaiSanResponse getTaiSanById(Long id) {
        TaiSan taiSan = taiSanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản", "id", id));
        
        if (taiSan.getDaxoa()) {
            throw new ResourceNotFoundException("Tài sản", "id", id);
        }
        
        return mapToResponse(taiSan);
    }
    
    @Transactional(readOnly = true)
    public TaiSanResponse getTaiSanByMa(String mataisan) {
        TaiSan taiSan = taiSanRepository.findByMataisan(mataisan)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản", "mã", mataisan));
        
        if (taiSan.getDaxoa()) {
            throw new ResourceNotFoundException("Tài sản", "mã", mataisan);
        }
        
        return mapToResponse(taiSan);
    }
    
    @Transactional(readOnly = true)
    public List<TaiSanResponse> searchTaiSan(String keyword) {
        return taiSanRepository.searchByKeyword(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaiSanResponse> getTaiSanByLoai(Integer loaitaisanId) {
        return taiSanRepository.findByLoaiTaiSan(loaitaisanId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TaiSanResponse createTaiSan(TaiSanRequest request) {
        // Kiem tra ma tai san da ton tai chua
        if (taiSanRepository.existsByMataisan(request.getMataisan())) {
            throw new BadRequestException("Mã tài sản đã tồn tại: " + request.getMataisan());
        }
        
        TaiSan taiSan = new TaiSan();
        mapRequestToEntity(request, taiSan);
        
        TaiSan saved = taiSanRepository.save(taiSan);
        return mapToResponse(saved);
    }
    
    @Transactional
    public TaiSanResponse updateTaiSan(Long id, TaiSanRequest request) {
        TaiSan taiSan = taiSanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản", "id", id));
        
        if (taiSan.getDaxoa()) {
            throw new BadRequestException("Không thể cập nhật tài sản đã bị xóa");
        }
        
        // Kiem tra ma tai san da ton tai chua (tru chinh no)
        if (taiSanRepository.existsByMataisanAndTaisanIdNot(request.getMataisan(), id)) {
            throw new BadRequestException("Mã tài sản đã tồn tại: " + request.getMataisan());
        }
        
        mapRequestToEntity(request, taiSan);
        
        TaiSan updated = taiSanRepository.save(taiSan);
        return mapToResponse(updated);
    }
    
    @Transactional
    public void deleteTaiSan(Long id) {
        TaiSan taiSan = taiSanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tài sản", "id", id));
        
        // Xoa mem
        taiSan.setDaxoa(true);
        taiSanRepository.save(taiSan);
    }
    
    private void mapRequestToEntity(TaiSanRequest request, TaiSan entity) {
        entity.setMataisan(request.getMataisan());
        entity.setTentaisan(request.getTentaisan());
        entity.setThongsokythuat(request.getThongsokythuat());
        entity.setNgaynhap(request.getNgaynhap());
        entity.setGiatri(request.getGiatri());
        
        // Load loai tai san
        LoaiTaiSan loaiTaiSan = loaiTaiSanRepository.findById(request.getLoaitaisanId())
                .orElseThrow(() -> new ResourceNotFoundException("Loại tài sản", "id", request.getLoaitaisanId()));
        entity.setLoaitaisan(loaiTaiSan);
        
        // Load vi tri (optional)
        if (request.getVitriId() != null) {
            ViTri vitri = viTriRepository.findById(request.getVitriId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vị trí", "id", request.getVitriId()));
            entity.setVitri(vitri);
        } else {
            entity.setVitri(null);
        }
        
        // Load trang thai
        TrangThaiTaiSan trangThai = trangThaiTaiSanRepository.findById(request.getTrangthaitaisanId())
                .orElseThrow(() -> new ResourceNotFoundException("Trạng thái tài sản", "id", request.getTrangthaitaisanId()));
        entity.setTrangthaitaisan(trangThai);
        
        // Load nguoi su dung (optional)
        if (request.getNguoisudungId() != null) {
            NguoiDung nguoiDung = nguoiDungRepository.findById(request.getNguoisudungId())
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", request.getNguoisudungId()));
            entity.setNguoisudung(nguoiDung);
        } else {
            entity.setNguoisudung(null);
        }
    }
    
    private TaiSanResponse mapToResponse(TaiSan entity) {
        // Tạo QR code cho tài sản
        String qrCode = null;
        try {
            System.out.println("🔄 Generating QR Code for: " + entity.getMataisan());
            qrCode = qrCodeService.generateQRCodeForTaiSan(entity.getMataisan());
            
            if (qrCode != null && !qrCode.isEmpty()) {
                System.out.println("✅ QR Code generated successfully for: " + entity.getMataisan() + " (length: " + qrCode.length() + ")");
            } else {
                System.err.println("⚠️ QR Code is null or empty for: " + entity.getMataisan());
            }
        } catch (Exception e) {
            // Nếu lỗi tạo QR, không throw exception, chỉ log
            System.err.println("❌ Error generating QR code for: " + entity.getMataisan());
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
        
        return TaiSanResponse.builder()
                .taisanId(entity.getTaisanId())
                .mataisan(entity.getMataisan())
                .tentaisan(entity.getTentaisan())
                .loaitaisanId(entity.getLoaitaisan().getLoaitaisanId())
                .tenloai(entity.getLoaitaisan().getTenloai())
                .thongsokythuat(entity.getThongsokythuat())
                .ngaynhap(entity.getNgaynhap())
                .giatri(entity.getGiatri())
                .vitriId(entity.getVitri() != null ? entity.getVitri().getVitriId() : null)
                .tenvitri(entity.getVitri() != null ? entity.getVitri().getTenvitri() : null)
                .donviId(entity.getVitri() != null && entity.getVitri().getDonvi() != null ? entity.getVitri().getDonvi().getDonviId() : null)
                .tendonvi(entity.getVitri() != null && entity.getVitri().getDonvi() != null ? entity.getVitri().getDonvi().getTendonvi() : null)
                .trangthaitaisanId(entity.getTrangthaitaisan().getTrangthaitaisanId())
                .tentrangthai(entity.getTrangthaitaisan().getTentrangthai())
                .nguoisudungId(entity.getNguoisudung() != null ? entity.getNguoisudung().getNguoidungId() : null)
                .tennguoisudung(entity.getNguoisudung() != null ? entity.getNguoisudung().getHoten() : null)
                .daxoa(entity.getDaxoa())
                .ngaytao(entity.getNgaytao())
                .qrCode(qrCode)
                .build();
    }
}

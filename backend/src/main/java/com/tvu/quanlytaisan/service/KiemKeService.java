package com.tvu.quanlytaisan.service;

import com.tvu.quanlytaisan.dto.request.DotKiemKeRequest;
import com.tvu.quanlytaisan.dto.request.KiemKeRequest;
import com.tvu.quanlytaisan.dto.response.ChiTietKiemKeResponse;
import com.tvu.quanlytaisan.dto.response.DotKiemKeResponse;
import com.tvu.quanlytaisan.entity.*;
import com.tvu.quanlytaisan.enums.KetQuaKiemKe;
import com.tvu.quanlytaisan.enums.TrangThaiDotKiemKe;
import com.tvu.quanlytaisan.exception.BadRequestException;
import com.tvu.quanlytaisan.exception.ResourceNotFoundException;
import com.tvu.quanlytaisan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KiemKeService {
    
    private final DotKiemKeRepository dotKiemKeRepository;
    private final ChiTietKiemKeRepository chiTietKiemKeRepository;
    private final TaiSanRepository taiSanRepository;
    private final DonViRepository donViRepository;
    private final ViTriRepository viTriRepository;
    private final NguoiDungRepository nguoiDungRepository;
    
    @Transactional
    public DotKiemKeResponse createDotKiemKe(DotKiemKeRequest request, Long nguoidungId) {
        // Validate
        if (request.getTendot() == null || request.getTendot().trim().isEmpty()) {
            throw new BadRequestException("Tên đợt kiểm kê không được để trống");
        }
        if (request.getNgaybatdau() == null) {
            throw new BadRequestException("Ngày bắt đầu không được để trống");
        }
        
        // Create DotKiemKe
        DotKiemKe dotKiemKe = new DotKiemKe();
        dotKiemKe.setTendot(request.getTendot());
        dotKiemKe.setNgaybatdau(request.getNgaybatdau());
        dotKiemKe.setTrangthai(TrangThaiDotKiemKe.DANGMO);
        
        // Set donvi if provided
        if (request.getDonviId() != null) {
            DonVi donVi = donViRepository.findById(request.getDonviId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn vị"));
            dotKiemKe.setDonvi(donVi);
        }
        
        DotKiemKe savedDot = dotKiemKeRepository.save(dotKiemKe);
        
        // Tạo danh sách chi tiết kiểm kê cho tất cả tài sản (hoặc theo đơn vị)
        List<TaiSan> danhSachTaiSan;
        if (request.getDonviId() != null) {
            // Lấy tài sản theo đơn vị (qua vị trí)
            danhSachTaiSan = taiSanRepository.findByViTriDonviDonviId(request.getDonviId());
        } else {
            // Lấy tất cả tài sản
            danhSachTaiSan = taiSanRepository.findByDaxoa(false);
        }
        
        for (TaiSan taiSan : danhSachTaiSan) {
            ChiTietKiemKe chiTiet = new ChiTietKiemKe();
            chiTiet.setDotkiemke(savedDot);
            chiTiet.setTaisan(taiSan);
            chiTiet.setKetqua(KetQuaKiemKe.CHUAKIEM);
            chiTietKiemKeRepository.save(chiTiet);
        }
        
        return convertToResponse(savedDot);
    }
    
    @Transactional(readOnly = true)
    public List<DotKiemKeResponse> getAllDotKiemKe() {
        return dotKiemKeRepository.findAllByOrderByNgaybatdauDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<DotKiemKeResponse> getDotKiemKeByTrangthai(TrangThaiDotKiemKe trangthai) {
        return dotKiemKeRepository.findByTrangthaiOrderByNgaybatdauDesc(trangthai)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public DotKiemKeResponse getDotKiemKeById(Long id) {
        DotKiemKe dotKiemKe = dotKiemKeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đợt kiểm kê"));
        return convertToResponse(dotKiemKe);
    }
    
    @Transactional(readOnly = true)
    public List<ChiTietKiemKeResponse> getChiTietKiemKe(Long dotkiemkeId) {
        return chiTietKiemKeRepository.findByDotkiemkeDotkiemkeId(dotkiemkeId)
                .stream()
                .map(this::convertChiTietToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ChiTietKiemKeResponse kiemTraTaiSan(KiemKeRequest request, Long nguoidungId) {
        // Validate
        DotKiemKe dotKiemKe = dotKiemKeRepository.findById(request.getDotkiemkeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đợt kiểm kê"));
        
        if (dotKiemKe.getTrangthai() == TrangThaiDotKiemKe.DADONG) {
            throw new BadRequestException("Đợt kiểm kê đã đóng, không thể cập nhật");
        }
        
        TaiSan taiSan = taiSanRepository.findById(request.getTaisanId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài sản"));
        
        NguoiDung nguoiDung = nguoiDungRepository.findById(nguoidungId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        
        // Tìm hoặc tạo chi tiết kiểm kê
        ChiTietKiemKe chiTiet = chiTietKiemKeRepository
                .findByDotkiemkeDotkiemkeIdAndTaisanTaisanId(request.getDotkiemkeId(), request.getTaisanId())
                .orElseGet(() -> {
                    ChiTietKiemKe newChiTiet = new ChiTietKiemKe();
                    newChiTiet.setDotkiemke(dotKiemKe);
                    newChiTiet.setTaisan(taiSan);
                    return newChiTiet;
                });
        
        chiTiet.setKetqua(request.getKetqua());
        chiTiet.setNguoidung(nguoiDung);
        chiTiet.setThoigiankiem(LocalDateTime.now());
        
        // Nếu lệch vị trí, lưu vị trí thực tế
        if (request.getKetqua() == KetQuaKiemKe.LECHVITRI && request.getVitrithucteId() != null) {
            ViTri viTriThucTe = viTriRepository.findById(request.getVitrithucteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vị trí thực tế"));
            chiTiet.setVitrithucte(viTriThucTe);
        } else {
            chiTiet.setVitrithucte(null);
        }
        
        ChiTietKiemKe saved = chiTietKiemKeRepository.save(chiTiet);
        return convertChiTietToResponse(saved);
    }
    
    @Transactional
    public DotKiemKeResponse dongDotKiemKe(Long dotkiemkeId) {
        DotKiemKe dotKiemKe = dotKiemKeRepository.findById(dotkiemkeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đợt kiểm kê"));
        
        dotKiemKe.setTrangthai(TrangThaiDotKiemKe.DADONG);
        DotKiemKe saved = dotKiemKeRepository.save(dotKiemKe);
        return convertToResponse(saved);
    }
    
    private DotKiemKeResponse convertToResponse(DotKiemKe dotKiemKe) {
        Long tongTaiSan = chiTietKiemKeRepository.countByDotkiemkeDotkiemkeId(dotKiemKe.getDotkiemkeId());
        Long daKiem = chiTietKiemKeRepository.countDaKiem(dotKiemKe.getDotkiemkeId());
        Long chuaKiem = chiTietKiemKeRepository.countByDotkiemkeDotkiemkeIdAndKetqua(dotKiemKe.getDotkiemkeId(), KetQuaKiemKe.CHUAKIEM);
        Long coMatDungViTri = chiTietKiemKeRepository.countByDotkiemkeDotkiemkeIdAndKetqua(dotKiemKe.getDotkiemkeId(), KetQuaKiemKe.CO);
        Long coMatLechViTri = chiTietKiemKeRepository.countByDotkiemkeDotkiemkeIdAndKetqua(dotKiemKe.getDotkiemkeId(), KetQuaKiemKe.LECHVITRI);
        Long thieu = chiTietKiemKeRepository.countByDotkiemkeDotkiemkeIdAndKetqua(dotKiemKe.getDotkiemkeId(), KetQuaKiemKe.THIEU);
        
        return DotKiemKeResponse.builder()
                .dotkiemkeId(dotKiemKe.getDotkiemkeId())
                .tendot(dotKiemKe.getTendot())
                .donviId(dotKiemKe.getDonvi() != null ? dotKiemKe.getDonvi().getDonviId() : null)
                .tendonvi(dotKiemKe.getDonvi() != null ? dotKiemKe.getDonvi().getTendonvi() : "Toàn trường")
                .ngaybatdau(dotKiemKe.getNgaybatdau())
                .trangthai(dotKiemKe.getTrangthai())
                .tongTaiSan(tongTaiSan)
                .daKiem(daKiem)
                .chuaKiem(chuaKiem)
                .coMatDungViTri(coMatDungViTri)
                .coMatLechViTri(coMatLechViTri)
                .thieu(thieu)
                .build();
    }
    
    private ChiTietKiemKeResponse convertChiTietToResponse(ChiTietKiemKe chiTiet) {
        return ChiTietKiemKeResponse.builder()
                .chitietkiemkeId(chiTiet.getChitietkiemkeId())
                .dotkiemkeId(chiTiet.getDotkiemke().getDotkiemkeId())
                .taisanId(chiTiet.getTaisan().getTaisanId())
                .mataisan(chiTiet.getTaisan().getMataisan())
                .tentaisan(chiTiet.getTaisan().getTentaisan())
                .tenloai(chiTiet.getTaisan().getLoaitaisan() != null ? chiTiet.getTaisan().getLoaitaisan().getTenloai() : null)
                .vitriId(chiTiet.getTaisan().getVitri() != null ? chiTiet.getTaisan().getVitri().getVitriId() : null)
                .tenvitri(chiTiet.getTaisan().getVitri() != null ? chiTiet.getTaisan().getVitri().getTenvitri() : null)
                .tendonvi(chiTiet.getTaisan().getVitri() != null && chiTiet.getTaisan().getVitri().getDonvi() != null 
                        ? chiTiet.getTaisan().getVitri().getDonvi().getTendonvi() : null)
                .ketqua(chiTiet.getKetqua())
                .vitrithucteId(chiTiet.getVitrithucte() != null ? chiTiet.getVitrithucte().getVitriId() : null)
                .tenvitrithucte(chiTiet.getVitrithucte() != null ? chiTiet.getVitrithucte().getTenvitri() : null)
                .tendonvithucte(chiTiet.getVitrithucte() != null && chiTiet.getVitrithucte().getDonvi() != null 
                        ? chiTiet.getVitrithucte().getDonvi().getTendonvi() : null)
                .nguoidungId(chiTiet.getNguoidung() != null ? chiTiet.getNguoidung().getNguoidungId() : null)
                .hotennguoikiem(chiTiet.getNguoidung() != null ? chiTiet.getNguoidung().getHoten() : null)
                .thoigiankiem(chiTiet.getThoigiankiem())
                .build();
    }
}

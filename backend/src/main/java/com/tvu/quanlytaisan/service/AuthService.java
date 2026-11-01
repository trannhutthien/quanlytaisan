package com.tvu.quanlytaisan.service;

import com.tvu.quanlytaisan.dto.request.ChangePasswordRequest;
import com.tvu.quanlytaisan.dto.request.LoginRequest;
import com.tvu.quanlytaisan.dto.response.LoginResponse;
import com.tvu.quanlytaisan.dto.response.UserInfoResponse;
import com.tvu.quanlytaisan.entity.NguoiDung;
import com.tvu.quanlytaisan.exception.BadRequestException;
import com.tvu.quanlytaisan.exception.ResourceNotFoundException;
import com.tvu.quanlytaisan.exception.UnauthorizedException;
import com.tvu.quanlytaisan.repository.NguoiDungRepository;
import com.tvu.quanlytaisan.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        // Authenticate
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getTendangnhap(),
                        request.getMatkhau()
                )
        );
        
        // Get user
        NguoiDung nguoiDung = nguoiDungRepository.findByTendangnhap(request.getTendangnhap())
                .orElseThrow(() -> new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng"));
        
        if (!nguoiDung.getHoatdong()) {
            throw new UnauthorizedException("Tài khoản đã bị khóa");
        }
        
        // Generate token
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(nguoiDung.getTendangnhap())
                .password(nguoiDung.getMatkhaumahoa())
                .authorities("ROLE_" + nguoiDung.getVaitro().name())
                .build();
        
        String token = jwtService.generateToken(userDetails);
        
        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .nguoidungId(nguoiDung.getNguoidungId())
                .tendangnhap(nguoiDung.getTendangnhap())
                .hoten(nguoiDung.getHoten())
                .email(nguoiDung.getEmail())
                .vaitro(nguoiDung.getVaitro())
                .build();
    }
    
    @Transactional(readOnly = true)
    public UserInfoResponse getCurrentUser() {
        String username = getCurrentUsername();
        NguoiDung nguoiDung = nguoiDungRepository.findByTendangnhap(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        
        return UserInfoResponse.builder()
                .nguoidungId(nguoiDung.getNguoidungId())
                .tendangnhap(nguoiDung.getTendangnhap())
                .hoten(nguoiDung.getHoten())
                .email(nguoiDung.getEmail())
                .vaitro(nguoiDung.getVaitro())
                .tenDonVi(nguoiDung.getDonvi() != null ? nguoiDung.getDonvi().getTendonvi() : null)
                .hoatdong(nguoiDung.getHoatdong())
                .build();
    }
    
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        String username = getCurrentUsername();
        NguoiDung nguoiDung = nguoiDungRepository.findByTendangnhap(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        
        // Verify old password
        if (!passwordEncoder.matches(request.getMatkhauCu(), nguoiDung.getMatkhaumahoa())) {
            throw new BadRequestException("Mật khẩu cũ không đúng");
        }
        
        // Update password
        nguoiDung.setMatkhaumahoa(passwordEncoder.encode(request.getMatkhauMoi()));
        nguoiDungRepository.save(nguoiDung);
    }
    
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Chưa đăng nhập");
        }
        return authentication.getName();
    }
}

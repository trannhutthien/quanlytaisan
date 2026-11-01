package com.tvu.quanlytaisan.security;

import com.tvu.quanlytaisan.entity.NguoiDung;
import com.tvu.quanlytaisan.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final NguoiDungRepository nguoiDungRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        NguoiDung nguoiDung = nguoiDungRepository.findByTendangnhap(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));
        
        if (!nguoiDung.getHoatdong()) {
            throw new UsernameNotFoundException("Tài khoản đã bị khóa");
        }
        
        return User.builder()
                .username(nguoiDung.getTendangnhap())
                .password(nguoiDung.getMatkhaumahoa())
                .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + nguoiDung.getVaitro().name())
                ))
                .build();
    }
}

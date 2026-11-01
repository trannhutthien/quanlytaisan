package com.tvu.quanlytaisan.config;

import com.tvu.quanlytaisan.entity.NguoiDung;
import com.tvu.quanlytaisan.enums.VaiTro;
import com.tvu.quanlytaisan.repository.NguoiDungRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final NguoiDungRepository nguoiDungRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Tạo user admin mặc định nếu chưa có
        if (!nguoiDungRepository.existsByTendangnhap("admin")) {
            NguoiDung admin = new NguoiDung();
            admin.setTendangnhap("admin");
            admin.setMatkhaumahoa(passwordEncoder.encode("admin123"));
            admin.setHoten("Administrator");
            admin.setEmail("admin@quanlytaisan.com");
            admin.setVaitro(VaiTro.ADMIN);
            admin.setHoatdong(true);
            
            nguoiDungRepository.save(admin);
            log.info("✅ Created default admin user: admin/admin123");
        }
        
        // Tạo user thường mặc định
        if (!nguoiDungRepository.existsByTendangnhap("user")) {
            NguoiDung user = new NguoiDung();
            user.setTendangnhap("user");
            user.setMatkhaumahoa(passwordEncoder.encode("user123"));
            user.setHoten("User Demo");
            user.setEmail("user@quanlytaisan.com");
            user.setVaitro(VaiTro.USER);
            user.setHoatdong(true);
            
            nguoiDungRepository.save(user);
            log.info("✅ Created default user: user/user123");
        }
    }
}

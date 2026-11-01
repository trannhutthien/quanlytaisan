package com.tvu.quanlytaisan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình CORS (Cross-Origin Resource Sharing)
 * Cho phép frontend gọi API từ origin khác
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Đã có context-path /api rồi
                // Cho phép các origin này gọi API
                .allowedOrigins(
                    "http://localhost:5173",      // Vite dev server
                    "http://localhost:3000",      // React dev server (backup)
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:3000"
                )
                // Cho phép các HTTP methods
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                // Cho phép các headers
                .allowedHeaders("*")
                // Cho phép gửi credentials (cookies, authorization headers)
                .allowCredentials(true)
                // Thời gian cache preflight request (1 giờ)
                .maxAge(3600);
    }
}

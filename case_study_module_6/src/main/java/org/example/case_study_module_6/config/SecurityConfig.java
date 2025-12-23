package org.example.case_study_module_6.config;

import org.example.case_study_module_6.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF (để cho phép POST/PUT/DELETE)
                .csrf(csrf -> csrf.disable())

                // 2. Cấu hình CORS (quan trọng để React gọi được)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Phân quyền: Tạm thời cho phép TẤT CẢ (permitAll)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // API đăng nhập/đăng ký
                        .requestMatchers("/api/**").permitAll()  // API khách hàng
                        .anyRequest().permitAll()                // Cho phép hết để test cho dễ
                )

                // Vẫn giữ filter nhưng vì đã permitAll nên không có token vẫn qua được
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean cấu hình CORS chi tiết
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép React chạy ở cổng 5173 (Vite)
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Cho phép các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Cho phép tất cả các Header (Authorization, Content-Type...)
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Cho phép gửi credentials (nếu cần sau này)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
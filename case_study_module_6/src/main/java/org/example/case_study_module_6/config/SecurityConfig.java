package org.example.case_study_module_6.config;

import org.example.case_study_module_6.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <--- Đã thêm import này để dùng HttpMethod.GET
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
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth
                        // --- CÁC CẤU HÌNH CŨ (GIỮ NGUYÊN) ---
                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers("/api/bookings/online")
                        .hasAnyRole("CUSTOMER")

                        .requestMatchers("/api/bookings/**")
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers("/api/master/**")
                        .hasAnyRole("EMPLOYEE", "ADMIN", "CUSTOMER")

                        .requestMatchers("/api/flights/**")
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers("/v1/api/employees/**")
                        .hasAnyRole( "ADMIN")

                        .requestMatchers("/api/customers/**")
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers("/api/reports/**")
                        .hasAnyRole("ADMIN")

                        // 1. Cho phép TẤT CẢ mọi người (kể cả chưa đăng nhập) được XEM tin tức
                        // (Chỉ áp dụng cho phương thức GET)
                        .requestMatchers(HttpMethod.GET, "/api/news/**").permitAll()

                        // 2. Các hành động còn lại (Thêm, Sửa, Xóa - POST/PUT/DELETE)
                        // Bắt buộc phải là ADMIN mới được phép truy cập
                        .requestMatchers("/api/news/**").hasAnyRole("ADMIN")

                        // (Nếu bạn có một API riêng biệt tên là /api/admin/news thì giữ dòng dưới,
                        // còn nếu dùng chung /api/news thì dòng trên đã bao phủ rồi)
                        .requestMatchers("/api/admin/news").hasAnyRole("ADMIN")

                        // --- QUY TẮC CUỐI CÙNG (GIỮ NGUYÊN) ---
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
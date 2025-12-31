package org.example.case_study_module_6.config;

import org.example.case_study_module_6.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
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
                // 1. Tắt CSRF (để cho phép POST/PUT/DELETE từ React)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Kích hoạt CORS với cấu hình bên dưới
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Phân quyền truy cập
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/**").permitAll()


                        .requestMatchers("/api/master/**")
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers("/api/**")
                        .hasAnyRole("CUSTOMER")

                        .requestMatchers("/api/flights/**")
                        .hasAnyRole("EMPLOYEE", "ADMIN")


                        .requestMatchers("/v1/api/employees/**")
                        .hasAnyRole("ADMIN")

                        .requestMatchers("/api/customers/**")
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .anyRequest().authenticated()
                        // --- NHÓM CÔNG KHAI (Không cần đăng nhập) ---

                        // Swagger UI
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Auth & Master Data
                        .requestMatchers("/auth/**", "/api/master/**", "/api/flights/**").permitAll()

                        // Customers & News (Theo yêu cầu của bạn)
                        .requestMatchers("/api/customers/**", "/api/news/**").permitAll()

                        // Cho phép phương thức OPTIONS (tránh lỗi CORS pre-flight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // --- QUY TẮC CUỐI CÙNG (BẮT BUỘC ĐỂ Ở CUỐI) ---
                        // Tạm thời cho phép tất cả để test dễ dàng.
                        // Sau này muốn bảo mật thì đổi .permitAll() thành .authenticated()
                        .anyRequest().permitAll()
                )

                // 4. Thêm JWT Filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép các nguồn Frontend (Thêm cả 5174 đề phòng bạn chạy port khác)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174"));

        // Cho phép các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Cho phép tất cả các Header
        configuration.setAllowedHeaders(List.of("*"));

        // Cho phép gửi credentials (Cookie/Auth Header)
        configuration.setAllowCredentials(true);
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
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
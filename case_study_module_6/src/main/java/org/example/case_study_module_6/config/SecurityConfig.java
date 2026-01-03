package org.example.case_study_module_6.config;

import org.example.case_study_module_6.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

                        // ===== CORS PREFLIGHT =====
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/bookings/online").permitAll()

                        // ===== PUBLIC =====
                        .requestMatchers(
                                "/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",

                                // 🔥 BẮT BUỘC CHO WEBSOCKET
                                "/ws-chat/**",
                                "/app/**",
                                "/topic/**",
                                "/queue/**",
                                "/user/**",

                                "/api/payment/**",
                                "/api/master/airports",
                                "/api/master/airlines",
                                "/api/master/routes"
                        ).permitAll()

                        // ===== SEARCH FLIGHTS =====
                        .requestMatchers(HttpMethod.GET, "/api/flights/**")
                        .permitAll()

                        // ===== CUSTOMER BOOKING (FIX QUAN TRỌNG) =====
                        .requestMatchers(HttpMethod.POST, "/api/bookings/online")
                        .hasRole("CUSTOMER")

                        .requestMatchers("/api/customers/me")
                        .hasAnyRole("CUSTOMER", "EMPLOYEE", "ADMIN")
                        // ===== ADMIN / EMPLOYEE =====
                        .requestMatchers(
                                "/api/master/**",
                                "/api/flights/**",
                                "/api/customers/**",
                                "/v1/api/employees/**"
                        ).hasAnyRole("EMPLOYEE", "ADMIN")



                        // ===== CUSTOMER DEFAULT =====
                        .requestMatchers("/api/**")
                        .hasRole("CUSTOMER")

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

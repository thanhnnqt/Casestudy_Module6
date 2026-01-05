package org.example.case_study_module_6.service.impl;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "12345678901234567890123456789012"; // >= 32 chars

    private static final long EXPIRATION =
            1000 * 60 * 60 * 24; // 24 giờ

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(
            String username,
            String role,
            Long customerId,
            String fullName,
            String provider
    ) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role.replace("ROLE_", ""))
                .claim("customerId", customerId)
                .claim("fullName", fullName)
                .claim("provider", provider)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String getUsernameFromToken(String token) {
        return extractClaims(token).getSubject();
    }

    public String getRoleFromToken(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public Long getCustomerIdFromToken(String token) {
        return extractClaims(token).get("customerId", Long.class);
    }

    public String getFullNameFromToken(String token) {
        return extractClaims(token).get("fullName", String.class);
    }

    public String getProviderFromToken(String token) {
        return extractClaims(token).get("provider", String.class);
    }
}

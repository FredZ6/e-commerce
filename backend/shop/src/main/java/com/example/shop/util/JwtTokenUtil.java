package com.example.shop.util;

import com.example.shop.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT 
 */
@Component
@Slf4j
public class JwtTokenUtil {

    // 
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // 
    private SecretKey getSigningKey() {
        //  Keys.secretKeyFor 
        if (secret == null || secret.trim().isEmpty()) {
            return Keys.secretKeyFor(SignatureAlgorithm.HS512);
        }
        
        // 
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length * 8 < 512) {  // 
            log.warn("Provided key is too short, generating a secure key");
            return Keys.secretKeyFor(SignatureAlgorithm.HS512);
        }
        
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", "ROLE_USER");  // claims

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(generateExpirationDate())
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // 
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // 
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    //  Claim
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    //  Claims
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 
    private Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + expiration * 1000);
    }

    // 
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // 
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    // 
    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.get("userId", Long.class);
        } catch (Exception e) {
            log.error("Error getting userId from token", e);
            return null;
        }
    }

    public String refreshToken(String token) {
        try {
            final Claims claims = getAllClaimsFromToken(token);
            claims.setIssuedAt(new Date());
            claims.setExpiration(generateExpirationDate());

            return Jwts.builder()
                    .setClaims(claims)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                    .compact();
        } catch (Exception e) {
            log.error("Error refreshing token", e);
            return null;
        }
    }
}

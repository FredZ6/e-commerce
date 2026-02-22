package com.example.shop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private Long expiresIn;  // token过期时间（秒）
    
    // 快速构造方法
    public static JwtResponse of(String token, Long id, String username, String email, List<String> roles, Long expiresIn) {
        return JwtResponse.builder()
                .token(token)
                .id(id)
                .username(username)
                .email(email)
                .roles(roles)
                .expiresIn(expiresIn)
                .build();
    }
}
package com.example.shop.controller;

import com.example.shop.model.User;
import com.example.shop.service.UserService;
import com.example.shop.service.LoginAttemptService;
import com.example.shop.util.JwtTokenUtil;
import com.example.shop.dto.JwtResponse;
import com.example.shop.dto.UserDto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Collections;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final LoginAttemptService loginAttemptService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public UserController(UserService userService,
                          LoginAttemptService loginAttemptService,
                          AuthenticationManager authenticationManager,
                          JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.loginAttemptService = loginAttemptService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    // 用户注册
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDto userDto) {
        // 验证密码确认
        if (!userDto.getPassword().equals(userDto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Password confirmation doesn't match");
        }

        // 创建 User 对象
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setPhone(userDto.getPhone());
        
        // 设置角色，如果没有指定则默认为USER
        String role = userDto.getRole() != null ? userDto.getRole() : "USER";
        if (!role.equals("USER") && !role.equals("ADMIN")) {
            return ResponseEntity.badRequest().body("Invalid role");
        }
        user.setRole(role);
        
        // 注册用户
        User registeredUser = userService.registerUser(user);
        
        // 生成 JWT 令牌
        String token = jwtTokenUtil.generateToken(registeredUser);
        
        // 构建响应
        return ResponseEntity.ok(JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(registeredUser.getId())
                .username(registeredUser.getUsername())
                .email(registeredUser.getEmail())
                .roles(Collections.singletonList("ROLE_" + registeredUser.getRole()))
                .expiresIn(jwtTokenUtil.getExpirationDateFromToken(token).getTime() - System.currentTimeMillis())
                .build());
    }

    // 用户登录
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserDto userDto) {
        String loginKey = userDto.getUsername();
        if (loginAttemptService.isBlocked(loginKey)) {
            return ResponseEntity.status(429).body("Too many login attempts. Try again later.");
        }

        try {
            // 进行身份验证
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userDto.getUsername(),
                            userDto.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            loginAttemptService.recordFailure(loginKey);
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // 获取用户信息并生成令牌
        final User user = userService.findByUsername(userDto.getUsername());
        final String token = jwtTokenUtil.generateToken(user);
        loginAttemptService.recordSuccess(loginKey);

        // 构建响应
        return ResponseEntity.ok(JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(Collections.singletonList("ROLE_" + user.getRole()))
                .expiresIn(jwtTokenUtil.getExpirationDateFromToken(token).getTime() - System.currentTimeMillis())
                .build());
    }

    // 获取当前用户信息
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwtToken = token.substring(7);
            String username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            User user = userService.findByUsername(username);
            
            // 转换为 UserDto
            UserDto userDto = UserDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .phone(user.getPhone())
                    .avatar(user.getAvatar())
                    .role(user.getRole())
                    .createdAt(user.getCreatedAt().toString())
                    .updatedAt(user.getUpdatedAt().toString())
                    .build();
                    
            return ResponseEntity.ok(userDto);
        }
        return ResponseEntity.status(401).body("Invalid token");
    }

    @PostMapping("/register/admin")
    @PreAuthorize("hasRole('ADMIN')")  // 只有管理员才能注册新管理员
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody UserDto userDto) {
        userDto.setRole("ADMIN");
        return registerUser(userDto);
    }
}

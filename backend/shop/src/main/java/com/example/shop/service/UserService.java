package com.example.shop.service;

import com.example.shop.model.User;
import com.example.shop.repository.UserRepository;
import com.example.shop.exception.ResourceNotFoundException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
            
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }

    // 
    public User registerUser(User user) {
        // 
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        // 
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // 
        return userRepository.save(user);
    }

    // 
    public User loginUser(String usernameOrEmail, String password) {
        Optional<User> userOptional = userRepository.findByUsername(usernameOrEmail);
        if (!userOptional.isPresent()) {
            userOptional = userRepository.findByEmail(usernameOrEmail);
            if (!userOptional.isPresent()) {
                throw new RuntimeException("User not found");
            }
        }
        User user = userOptional.get();
        // 
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return user;
    }

    // 
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // ID
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // 
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @PostConstruct
    public void init() {
        // 
        if (userRepository.count() == 0) {
            try {
                // email
                if (!userRepository.findByEmail("admin@example.com").isPresent()) {
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setPassword(passwordEncoder.encode("Admin123@"));
                    admin.setEmail("admin@example.com");
                    admin.setRole("ADMIN");
                    userRepository.save(admin);
                }
            } catch (Exception e) {
                // 
                log.warn("Failed to create admin user: {}", e.getMessage());
            }
        }
    }
}
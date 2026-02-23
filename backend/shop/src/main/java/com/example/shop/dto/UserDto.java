package com.example.shop.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]*$", message = "Username can only contain letters, numbers, underscores and hyphens")
    private String username;

    //@NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-zA-Z]).*$",
        message = "Password must contain at least one letter and one number"
    )
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // 
    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be in international format")
    private String phone;

    private String avatar;
    
    // 
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String createdAt;
    
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private String updatedAt;

    // 
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String confirmPassword;

    @Pattern(regexp = "^(USER|ADMIN)$", message = "Role must be either USER or ADMIN")
    @Size(max = 20)
    @Builder.Default
    private String role = "USER";
}

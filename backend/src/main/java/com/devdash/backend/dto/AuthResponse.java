package com.devdash.backend.dto;

import com.devdash.backend.entity.UserRole;
import lombok.*;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private UUID userId;
    private UserRole role;
    private String fullName;
    private String email;
}
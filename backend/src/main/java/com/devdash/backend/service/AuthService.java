package com.devdash.backend.service;

import com.devdash.backend.dto.AuthResponse;
import com.devdash.backend.dto.LoginDTO;
import com.devdash.backend.dto.RegisterDTO;
import com.devdash.dto.*;
import com.devdash.backend.entity.User;
import com.devdash.backend.repository.UserRepository;
import com.repairmatch.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse register(@Valid RegisterDTO dto) {
        // Validate uniqueness
        if (userRepo.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Email already registered");
        }
        if (userRepo.existsByPhoneNumber(dto.getPhoneNumber())) {
            throw new IllegalStateException("Phone number already registered");
        }

        // Create user
        User user = User.builder()
                .role(dto.getRole())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .isVerified(true) // Mock verification for MVP
                .build();

        user = userRepo.save(user);

        // Generate token
        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(@Valid LoginDTO dto) {
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalStateException("Invalid credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new IllegalStateException("Invalid credentials");
        }

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
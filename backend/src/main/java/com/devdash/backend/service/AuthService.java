package com.devdash.backend.service;

import com.devdash.backend.dto.AuthResponse;
import com.devdash.backend.dto.LoginDTO;
import com.devdash.backend.dto.RegisterDTO;
import com.devdash.backend.entity.User;
import com.devdash.backend.exception.ConflictException;
import com.devdash.backend.exception.UnauthorizedException;
import com.devdash.backend.repository.UserRepository;
import com.devdash.backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse register(@Valid RegisterDTO dto) {
        // Validate uniqueness
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ConflictException("Email already registered");
        }
        if (userRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
            throw new ConflictException("Phone number already registered");
        }

        // Create user
        User user = User.builder()
                .role(dto.getRole())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .isVerified(false)
                .build();

        user = userRepository.save(user);

        // Generate token
        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(@Valid LoginDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
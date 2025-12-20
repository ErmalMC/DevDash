package com.devdash.backend.entity;

import com.devdash.backend.entity.UserRole;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterDTO {
    @NotNull
    private UserRole role;

    @NotBlank
    @Size(min = 2, max = 100)
    private String fullName;

    @NotBlank
    @Pattern(regexp = "^\\+389[0-9]{8}$", message = "Phone must be +389XXXXXXXX")
    private String phoneNumber;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;
}
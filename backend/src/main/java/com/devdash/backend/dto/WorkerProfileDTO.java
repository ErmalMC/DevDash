package com.devdash.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileDTO {

    private UUID id;

    private UUID userId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Valid email is required")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Valid phone number is required")
    private String phoneNumber;

    @NotNull(message = "Service radius is required")
    @Min(value = 1, message = "Service radius must be at least 1 km")
    @Max(value = 200, message = "Service radius cannot exceed 200 km")
    private Integer serviceRadiusKm;

    @NotNull(message = "Base location latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double baseLocationLat;

    @NotNull(message = "Base location longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double baseLocationLng;

    @Min(value = 0, message = "Minimum hourly rate cannot be negative")
    private Integer hourlyRateMin;

    @Min(value = 0, message = "Maximum hourly rate cannot be negative")
    private Integer hourlyRateMax;

    private Double ratingAverage;

    private Integer ratingCount;

    private Boolean isApproved;

    @NotEmpty(message = "At least one skill is required")
    private Set<String> skills;

    private String title; // e.g., "Master Electrician"

    private String about; // Bio/description

    private String location; // Human-readable location
}
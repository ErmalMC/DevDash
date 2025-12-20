package com.devdash.backend.dto;

import com.devdash.backend.entity.SkillCategory;
import com.devdash.backend.entity.Urgency;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateRequestDTO {
    @NotNull
    private SkillCategory category;

    @NotBlank
    @Size(max = 1000)
    private String description;

    @NotNull
    private Urgency urgency;

    @NotBlank
    private String address;

    @NotNull
    @Min(-90) @Max(90)
    private Double latitude;

    @NotNull
    @Min(-180) @Max(180)
    private Double longitude;
}
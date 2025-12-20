package com.devdash.backend.entity;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RateJobDTO {
    @NotNull
    @Min(1) @Max(5)
    private Integer score;

    @Size(max = 500)
    private String comment;
}
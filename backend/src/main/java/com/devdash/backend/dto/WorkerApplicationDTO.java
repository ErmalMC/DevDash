package com.devdash.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for worker to apply/send message for a repair request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerApplicationDTO {

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 1000, message = "Message must be between 10 and 1000 characters")
    private String message;

    private Double proposedPrice; // Optional: worker can propose a price

    private String estimatedDuration; // Optional: e.g., "2-3 hours", "1 day"
}
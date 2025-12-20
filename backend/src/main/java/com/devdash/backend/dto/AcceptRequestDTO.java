package com.devdash.backend.entity;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AcceptRequestDTO {
    @NotNull
    @Future
    private LocalDateTime scheduledStart;

    @NotNull
    @Future
    private LocalDateTime scheduledEnd;

    private Integer estimatedPrice;
}
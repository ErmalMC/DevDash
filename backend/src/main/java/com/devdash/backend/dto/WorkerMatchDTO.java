package com.devdash.backend.dto;

import lombok.*;

import java.util.UUID;

@Data
@Builder
public class WorkerMatchDTO {
    private UUID workerId;
    private String workerName;
    private Double rating;
    private Integer ratingCount;
    private Double distanceKm;
    private Integer hourlyRateMin;
    private Integer hourlyRateMax;
}
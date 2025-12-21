package com.devdash.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerStats {
    private int totalJobsCompleted;
    private int activeJobs;
    private double averageRating;
    private int totalReviews;
    private double totalEarnings;
}
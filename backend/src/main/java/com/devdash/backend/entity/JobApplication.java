package com.devdash.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a worker's application to a repair request
 */
@Entity
@Table(name = "job_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * ✅ CHANGED to EAGER - So repair request details are included in JSON response
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "repair_request_id", nullable = false)
    @JsonIgnoreProperties({"citizen", "applications"}) // Prevent circular reference
    private RepairRequest repairRequest;

    /**
     * ✅ CHANGED to EAGER - So worker details are included in JSON response
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id", nullable = false)
    @JsonIgnoreProperties({"password", "workerProfile"}) // Don't expose sensitive data
    private User worker;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column
    private Double proposedPrice;

    @Column(length = 100)
    private String estimatedDuration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime respondedAt; // When citizen accepted/declined
}
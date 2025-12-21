package com.devdash.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "repair_request_id", nullable = false)
    private RepairRequest repairRequest;

    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private WorkerProfile worker;

    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private Double finalPrice;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ADD THIS METHOD - It's used in CitizenController and WorkerService
    public UUID getRepairRequestId() {
        return repairRequest != null ? repairRequest.getId() : null;
    }
}
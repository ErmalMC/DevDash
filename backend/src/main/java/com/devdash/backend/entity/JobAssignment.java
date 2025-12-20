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

    @OneToOne
    @JoinColumn(name = "repair_request_id", nullable = false, unique = true)
    private RepairRequest repairRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private WorkerProfile worker;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime acceptedAt = LocalDateTime.now();

    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private Integer finalPrice;
}
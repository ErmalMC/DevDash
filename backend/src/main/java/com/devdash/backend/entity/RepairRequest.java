package com.devdash.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ✅ FIXED: Added @JsonIgnoreProperties to prevent infinite recursion
 * when serializing the citizen relationship
 */
@Entity
@Table(name = "repair_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * ✅ FIXED: Changed to EAGER fetch and added JSON handling
     * This ensures the citizen is loaded when the request is fetched
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", nullable = false)
    @JsonIgnoreProperties({"password", "repairRequests", "workerProfile"})
    private User citizen;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillCategory category;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgency urgency;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.OPEN;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
package com.repairmatch.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "worker_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ElementCollection(targetClass = SkillCategory.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "worker_skills", joinColumns = @JoinColumn(name = "worker_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "skill")
    @Builder.Default
    private Set<SkillCategory> skills = new HashSet<>();

    @Column(nullable = false)
    private Integer serviceRadiusKm;

    @Column(nullable = false)
    private Double baseLocationLat;

    @Column(nullable = false)
    private Double baseLocationLng;

    private Integer hourlyRateMin;
    private Integer hourlyRateMax;

    @Column(nullable = false)
    @Builder.Default
    private Double ratingAverage = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer ratingCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isApproved = false;
}

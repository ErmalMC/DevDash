package com.devdash.backend.controller;

import com.devdash.backend.dto.WorkerProfileDTO;
import com.devdash.backend.entity.WorkerProfile;
import com.devdash.backend.exception.ResourceNotFoundException;
import com.devdash.backend.repository.WorkerProfileRepository;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Validated
public class PublicController {

    private final WorkerProfileRepository workerProfileRepository;

    /**
     * Get top-rated workers (publicly accessible)
     */
    @GetMapping("/workers/top")
    public ResponseEntity<List<WorkerProfileDTO>> getTopWorkers(
            @RequestParam(defaultValue = "4") @Min(1) @Max(20) int limit) {

        // Find approved workers sorted by rating
        List<WorkerProfile> topWorkers = workerProfileRepository
                .findByIsApprovedOrderByRatingAverageDesc(
                        true,
                        PageRequest.of(0, limit)
                );

        List<WorkerProfileDTO> dtos = topWorkers.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * Search workers by skill (publicly accessible)
     */
    @GetMapping("/workers/search")
    public ResponseEntity<List<WorkerProfileDTO>> searchWorkers(
            @RequestParam(required = false) String skill,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size) {

        List<WorkerProfile> workers;

        if (skill != null && !skill.trim().isEmpty()) {
            workers = workerProfileRepository
                    .findByIsApprovedAndSkillsContaining(
                            true,
                            skill.trim().toUpperCase(),
                            PageRequest.of(page, size)
                    );
        } else {
            workers = workerProfileRepository
                    .findByIsApproved(
                            true,
                            PageRequest.of(page, size)
                    );
        }

        List<WorkerProfileDTO> dtos = workers.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private WorkerProfileDTO mapToDTO(WorkerProfile profile) {
        // Convert Set<SkillCategory> to Set<String>
        Set<String> skillNames = profile.getSkills().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        return WorkerProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .phoneNumber(profile.getUser().getPhoneNumber())
                .serviceRadiusKm(profile.getServiceRadiusKm())
                .baseLocationLat(profile.getBaseLocationLat())
                .baseLocationLng(profile.getBaseLocationLng())
                .hourlyRateMin(profile.getHourlyRateMin())
                .hourlyRateMax(profile.getHourlyRateMax())
                .ratingAverage(profile.getRatingAverage())
                .ratingCount(profile.getRatingCount())
                .isApproved(profile.getIsApproved())
                .skills(skillNames)
                .title(getSkillTitle(profile))
                .location(profile.getServiceRadiusKm() + " km radius")
                .build();
    }

    private String getSkillTitle(WorkerProfile profile) {
        if (profile.getSkills() == null || profile.getSkills().isEmpty()) {
            return "Professional Worker";
        }

        // Get first skill and convert to title
        String primarySkill = profile.getSkills().iterator().next().name();
        switch (primarySkill.toUpperCase()) {
            case "ELECTRICIAN": return "Electrician";
            case "PLUMBER": return "Plumber";
            case "AC": return "AC Technician";
            case "APPLIANCE": return "Appliance Repair Specialist";
            default: return "Professional Worker";
        }
    }

    @GetMapping("/workers/{userId}")
    public ResponseEntity<WorkerProfileDTO> getWorkerByUserId(@PathVariable UUID userId) {
        WorkerProfile profile = workerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found"));

        WorkerProfileDTO dto = mapToDTO(profile);
        return ResponseEntity.ok(dto);
    }
}
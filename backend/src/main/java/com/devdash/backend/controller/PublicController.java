package com.devdash.backend.controller;

import com.devdash.backend.dto.WorkerProfileDTO;
import com.devdash.backend.entity.WorkerProfile;
import com.devdash.backend.repository.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicController {

    private final WorkerProfileRepository workerProfileRepository;

    /**
     * Get top-rated workers (publicly accessible)
     */
    @GetMapping("/workers/top")
    public ResponseEntity<List<WorkerProfileDTO>> getTopWorkers(
            @RequestParam(defaultValue = "4") int limit) {

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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<WorkerProfile> workers;

        if (skill != null && !skill.isEmpty()) {
            workers = workerProfileRepository
                    .findByIsApprovedAndSkillsContaining(
                            true,
                            skill.toUpperCase(),
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
                .skills(profile.getSkills())
                .title(getSkillTitle(profile))
                .location(profile.getServiceRadiusKm() + " km radius")
                .build();
    }

    private String getSkillTitle(WorkerProfile profile) {
        if (profile.getSkills() == null || profile.getSkills().isEmpty()) {
            return "Professional Worker";
        }

        String primarySkill = profile.getSkills().iterator().next();
        switch (primarySkill.toUpperCase()) {
            case "ELECTRICAL": return "Electrician";
            case "PLUMBING": return "Plumber";
            case "CARPENTRY": return "Carpenter";
            case "PAINTING": return "Painter";
            case "HVAC": return "HVAC Technician";
            case "APPLIANCES": return "Appliance Repair Specialist";
            case "LOCKSMITH": return "Locksmith";
            case "GENERAL_REPAIR": return "Handyman";
            default: return "Professional Worker";
        }
    }

    @GetMapping("/workers/{userId}")
    public ResponseEntity<WorkerProfileDTO> getWorkerByUserId(@PathVariable UUID userId) {
        WorkerProfile profile = workerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));

        WorkerProfileDTO dto = mapToDTO(profile);
        return ResponseEntity.ok(dto);
    }
}
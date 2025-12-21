package com.devdash.backend.service;

import com.devdash.backend.dto.AvailabilitySlotDTO;
import com.devdash.backend.dto.WorkerProfileDTO;
import com.devdash.backend.dto.WorkerStats;
import com.devdash.backend.entity.*;
import com.devdash.backend.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WorkerService {

    private final WorkerProfileRepository workerRepo;
    private final UserRepository userRepo;
    private final AvailabilitySlotRepository availabilityRepo;
    private final RepairRequestRepository requestRepo;
    private final JobAssignmentRepository assignmentRepo;

    public WorkerProfile getOrCreateProfile(UUID userId) {
        return workerRepo.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));
    }

    private WorkerProfile createDefaultProfile(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (user.getRole() != UserRole.WORKER) {
            throw new IllegalStateException("User is not a worker");
        }

        WorkerProfile profile = WorkerProfile.builder()
                .user(user)
                .skills(new HashSet<>())
                .serviceRadiusKm(10) // Default 10km
                .baseLocationLat(41.9973) // Skopje center default
                .baseLocationLng(21.4280)
                .isApproved(false)
                .build();

        return workerRepo.save(profile);
    }

    public List<AvailabilitySlot> setAvailability(@Valid List<AvailabilitySlotDTO> slots, UUID userId) {
        WorkerProfile profile = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        // Clear existing slots
        availabilityRepo.deleteByWorkerId(profile.getId());

        // Create new slots
        List<AvailabilitySlot> newSlots = slots.stream()
                .map(dto -> AvailabilitySlot.builder()
                        .worker(profile)
                        .dayOfWeek(dto.getDayOfWeek())
                        .startTime(dto.getStartTime())
                        .endTime(dto.getEndTime())
                        .build())
                .collect(Collectors.toList());

        return availabilityRepo.saveAll(newSlots);
    }

    @Transactional(readOnly = true)
    public List<RepairRequest> getAvailableRequests(UUID userId) {
        WorkerProfile profile = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        if (!profile.getIsApproved()) {
            log.warn("Worker {} not approved yet", userId);
            return Collections.emptyList();
        }

        // Get all open requests that match worker's skills
        List<RepairRequest> allOpen = requestRepo.findByStatus(RequestStatus.OPEN);

        return allOpen.stream()
                .filter(req -> profile.getSkills().contains(req.getCategory()))
                .collect(Collectors.toList());
    }

    // ========== NEW METHODS FOR PROFILE PAGE ==========

    /**
     * Get worker profile as DTO
     */
    @Transactional(readOnly = true)
    public WorkerProfileDTO getWorkerProfile(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        WorkerProfile profile = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        return mapToDTO(user, profile);
    }

    /**
     * Update worker profile
     */
    public WorkerProfileDTO updateProfile(WorkerProfileDTO dto, UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        WorkerProfile profile = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        // Update user info
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        // Update worker profile
        profile.setServiceRadiusKm(dto.getServiceRadiusKm());
        profile.setBaseLocationLat(dto.getBaseLocationLat());
        profile.setBaseLocationLng(dto.getBaseLocationLng());
        profile.setHourlyRateMin(dto.getHourlyRateMin());
        profile.setHourlyRateMax(dto.getHourlyRateMax());

        // Update skills if provided - CONVERT String to SkillCategory
        if (dto.getSkills() != null && !dto.getSkills().isEmpty()) {
            Set<SkillCategory> skillCategories = dto.getSkills().stream()
                    .map(skillName -> SkillCategory.valueOf(skillName.toUpperCase()))
                    .collect(Collectors.toSet());
            profile.setSkills(skillCategories);
        }

        userRepo.save(user);
        workerRepo.save(profile);

        return mapToDTO(user, profile);
    }

    /**
     * Get worker availability
     */
    @Transactional(readOnly = true)
    public List<AvailabilitySlot> getAvailability(UUID userId) {
        WorkerProfile profile = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        return availabilityRepo.findByWorkerId(profile.getId());
    }

    /**
     * Get nearby repair requests within specified radius
     */
    @Transactional(readOnly = true)
    public List<RepairRequest> getNearbyRequests(double lat, double lng, int radiusKm, UUID userId) {
        List<RepairRequest> openRequests = requestRepo.findByStatus(RequestStatus.OPEN);

        return openRequests.stream()
                .filter(request -> {
                    double distance = calculateDistance(lat, lng,
                            request.getLatitude(),
                            request.getLongitude());
                    return distance <= radiusKm;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get worker statistics
     */
    @Transactional(readOnly = true)
    public WorkerStats getWorkerStats(UUID userId) {
        WorkerProfile profile = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        List<JobAssignment> allJobs = assignmentRepo.findByWorkerId(profile.getId());

        // Count completed jobs
        int completedJobs = (int) allJobs.stream()
                .filter(job -> {
                    RepairRequest request = requestRepo.findById(job.getRepairRequestId())
                            .orElse(null);
                    return request != null && request.getStatus() == RequestStatus.COMPLETED;
                })
                .count();

        // Count active jobs - FIXED: use ASSIGNED instead of incorrect status
        int activeJobs = (int) allJobs.stream()
                .filter(job -> {
                    RepairRequest request = requestRepo.findById(job.getRepairRequestId())
                            .orElse(null);
                    return request != null &&
                            (request.getStatus() == RequestStatus.ASSIGNED ||
                                    request.getStatus() == RequestStatus.IN_PROGRESS);
                })
                .count();

        // Calculate total earnings
        double totalEarnings = allJobs.stream()
                .filter(job -> job.getFinalPrice() != null)
                .mapToDouble(JobAssignment::getFinalPrice)
                .sum();

        return WorkerStats.builder()
                .totalJobsCompleted(completedJobs)
                .activeJobs(activeJobs)
                .averageRating(profile.getRatingAverage() != null ? profile.getRatingAverage() : 0.0)
                .totalReviews(profile.getRatingCount() != null ? profile.getRatingCount() : 0)
                .totalEarnings(totalEarnings)
                .build();
    }

    // ========== HELPER METHODS ==========

    private WorkerProfileDTO mapToDTO(User user, WorkerProfile profile) {
        // Convert Set<SkillCategory> to Set<String>
        Set<String> skillNames = profile.getSkills().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        return WorkerProfileDTO.builder()
                .id(profile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
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
                .about("Experienced professional providing quality service")
                .build();
    }

    private String getSkillTitle(WorkerProfile profile) {
        if (profile.getSkills() == null || profile.getSkills().isEmpty()) {
            return "Skilled Professional";
        }

        // Get first skill name
        String primarySkill = profile.getSkills().iterator().next().name();
        switch (primarySkill.toUpperCase()) {
            case "ELECTRICIAN": return "Electrician";
            case "PLUMBER": return "Plumber";
            case "AC": return "AC Technician";
            case "APPLIANCE": return "Appliance Repair Specialist";
            default: return "Skilled Professional";
        }
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * Returns distance in kilometers
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // Radius in kilometers

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}
package com.repairmatch.service;

import com.repairmatch.dto.AvailabilitySlotDTO;
import com.repairmatch.entity.*;
import com.repairmatch.repository.*;
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

    public List<AvailabilitySlot> setAvailability(List<AvailabilitySlotDTO> slots, UUID userId) {
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
}
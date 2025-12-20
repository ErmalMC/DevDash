package com.repairmatch.service;

import com.repairmatch.dto.WorkerMatchDTO;
import com.repairmatch.entity.*;
import com.repairmatch.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MatchingService {

    private final WorkerProfileRepository workerRepo;
    private final AvailabilitySlotRepository availabilityRepo;
    private final JobAssignmentRepository assignmentRepo;

    private static final int MAX_MATCHES = 3;
    private static final int AVAILABILITY_WINDOW_HOURS = 48;
    private static final int EARTH_RADIUS_KM = 6371;

    /**
     * CORE MATCHING ALGORITHM
     * Finds the 3 best workers for a repair request
     */
    public List<WorkerMatchDTO> findMatchingWorkers(RepairRequest request) {
        log.info("Finding workers for request: {} ({})", request.getId(), request.getCategory());

        // STEP 1: Get approved workers with matching skill
        List<WorkerProfile> candidates = workerRepo.findApprovedWorkersBySkill(request.getCategory());
        log.debug("Found {} candidates with skill {}", candidates.size(), request.getCategory());

        // STEP 2: Filter by service radius
        List<WorkerProfile> inRange = candidates.stream()
                .filter(w -> isWithinRadius(
                        request.getLatitude(),
                        request.getLongitude(),
                        w.getBaseLocationLat(),
                        w.getBaseLocationLng(),
                        w.getServiceRadiusKm()
                ))
                .collect(Collectors.toList());

        log.debug("{} workers within service radius", inRange.size());

        // STEP 3: Check availability in next 48h
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowEnd = now.plusHours(AVAILABILITY_WINDOW_HOURS);

        List<WorkerMatchDTO> matches = new ArrayList<>();

        for (WorkerProfile worker : inRange) {
            if (hasAvailability(worker, now, windowEnd)) {
                double distance = calculateDistance(
                        request.getLatitude(),
                        request.getLongitude(),
                        worker.getBaseLocationLat(),
                        worker.getBaseLocationLng()
                );

                matches.add(WorkerMatchDTO.builder()
                        .workerId(worker.getId())
                        .workerName(worker.getUser().getFullName())
                        .rating(worker.getRatingAverage())
                        .ratingCount(worker.getRatingCount())
                        .distanceKm(Math.round(distance * 10.0) / 10.0) // Round to 1 decimal
                        .hourlyRateMin(worker.getHourlyRateMin())
                        .hourlyRateMax(worker.getHourlyRateMax())
                        .build());
            }
        }

        // STEP 4: Sort by distance (primary) and rating (secondary)
        matches.sort(Comparator
                .comparingDouble(WorkerMatchDTO::getDistanceKm)
                .thenComparing(Comparator.comparingDouble(WorkerMatchDTO::getRating).reversed()));

        // STEP 5: Return top 3
        List<WorkerMatchDTO> topMatches = matches.stream()
                .limit(MAX_MATCHES)
                .collect(Collectors.toList());

        log.info("Matched {} workers for request {}", topMatches.size(), request.getId());
        return topMatches;
    }

    /**
     * Check if worker is within service radius using Haversine formula
     */
    private boolean isWithinRadius(double lat1, double lon1, double lat2, double lon2, int radiusKm) {
        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        return distance <= radiusKm;
    }

    /**
     * Calculate distance between two points using Haversine formula
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    /**
     * Check if worker has availability in the time window
     */
    private boolean hasAvailability(WorkerProfile worker, LocalDateTime start, LocalDateTime end) {
        List<AvailabilitySlot> slots = availabilityRepo.findByWorkerId(worker.getId());

        if (slots.isEmpty()) {
            log.debug("Worker {} has no availability slots", worker.getId());
            return false;
        }

        // Check each day in the window
        LocalDate current = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();

        while (!current.isAfter(endDate)) {
            java.time.DayOfWeek day = current.getDayOfWeek();

            // Check if worker has availability slot for this day
            boolean hasSlotThisDay = slots.stream()
                    .anyMatch(s -> s.getDayOfWeek() == day);

            if (hasSlotThisDay) {
                // Check no conflicting assignments
                List<JobAssignment> assignments = assignmentRepo.findWorkerJobsInRange(
                        worker.getId(),
                        current.atStartOfDay(),
                        current.plusDays(1).atStartOfDay()
                );

                if (assignments.isEmpty()) {
                    return true; // Found available day!
                }
            }

            current = current.plusDays(1);
        }

        return false;
    }
}
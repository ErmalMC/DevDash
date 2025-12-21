package com.devdash.backend.controller;

import com.devdash.backend.dto.AcceptRequestDTO;
import com.devdash.backend.dto.AvailabilitySlotDTO;
import com.devdash.backend.dto.WorkerProfileDTO;
import com.devdash.backend.dto.WorkerStats;
import com.devdash.backend.entity.*;
import com.devdash.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerService workerService;
    private final JobService jobService;
    private final RepairRequestService repairRequestService;

    // ========== PROFILE ENDPOINTS ==========

    /**
     * Get worker's own profile
     */
    @GetMapping("/profile")
    public ResponseEntity<WorkerProfileDTO> getMyProfile(
            @AuthenticationPrincipal User user) {

        WorkerProfileDTO profile = workerService.getWorkerProfile(user.getId());
        return ResponseEntity.ok(profile);
    }

    /**
     * Update worker profile
     */
    @PutMapping("/profile")
    public ResponseEntity<WorkerProfileDTO> updateProfile(
            @Valid @RequestBody WorkerProfileDTO dto,
            @AuthenticationPrincipal User user) {

        WorkerProfileDTO updated = workerService.updateProfile(dto, user.getId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Get worker statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<WorkerStats> getStats(
            @AuthenticationPrincipal User user) {

        WorkerStats stats = workerService.getWorkerStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    // ========== REPAIR REQUEST ENDPOINTS ==========

    /**
     * Get all open repair requests (for marketplace/main page)
     */
    @GetMapping("/requests/open")
    public ResponseEntity<List<RepairRequest>> getOpenRequests() {
        List<RepairRequest> requests = repairRequestService.getOpenRequests();
        return ResponseEntity.ok(requests);
    }

    /**
     * Get a specific repair request by ID
     */
    @GetMapping("/requests/{id}")
    public ResponseEntity<RepairRequest> getRequestById(@PathVariable UUID id) {
        RepairRequest request = repairRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    /**
     * Get repair requests available for this worker (based on skills)
     */
    @GetMapping("/requests/available")
    public ResponseEntity<List<RepairRequest>> getAvailableRequests(
            @AuthenticationPrincipal User user) {

        List<RepairRequest> requests = workerService.getAvailableRequests(user.getId());
        return ResponseEntity.ok(requests);
    }

    /**
     * Get nearby repair requests based on location
     */
    @GetMapping("/requests/nearby")
    public ResponseEntity<List<RepairRequest>> getNearbyRequests(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") int radius,
            @AuthenticationPrincipal User user) {

        List<RepairRequest> requests = workerService.getNearbyRequests(lat, lng, radius, user.getId());
        return ResponseEntity.ok(requests);
    }

    /**
     * Accept a repair request
     */
    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<JobAssignment> acceptRequest(
            @PathVariable UUID id,
            @Valid @RequestBody AcceptRequestDTO dto,
            @AuthenticationPrincipal User user) {

        JobAssignment assignment = jobService.acceptRequest(id, dto, user.getId());
        return ResponseEntity.ok(assignment);
    }

    // ========== AVAILABILITY ENDPOINTS ==========

    /**
     * Set worker availability slots
     */
    @PostMapping("/availability")
    public ResponseEntity<List<AvailabilitySlot>> setAvailability(
            @Valid @RequestBody List<AvailabilitySlotDTO> slots,
            @AuthenticationPrincipal User user) {

        List<AvailabilitySlot> saved = workerService.setAvailability(slots, user.getId());
        return ResponseEntity.ok(saved);
    }

    /**
     * Get worker's availability
     */
    @GetMapping("/availability")
    public ResponseEntity<List<AvailabilitySlot>> getAvailability(
            @AuthenticationPrincipal User user) {

        List<AvailabilitySlot> slots = workerService.getAvailability(user.getId());
        return ResponseEntity.ok(slots);
    }

    // ========== JOB ENDPOINTS ==========

    /**
     * Get all jobs assigned to this worker
     */
    @GetMapping("/jobs/my")
    public ResponseEntity<List<JobAssignment>> getMyJobs(
            @AuthenticationPrincipal User user) {

        List<JobAssignment> jobs = jobService.getWorkerJobs(user.getId());
        return ResponseEntity.ok(jobs);
    }

    /**
     * Mark a job as complete
     */
    @PostMapping("/jobs/{id}/complete")
    public ResponseEntity<Void> completeJob(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        jobService.completeJob(id);
        return ResponseEntity.ok().build();
    }
}
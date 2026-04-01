package com.devdash.backend.controller;

import com.devdash.backend.dto.*;
import com.devdash.backend.entity.*;
import com.devdash.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/worker")
@RequiredArgsConstructor
@Slf4j
public class WorkerController {

    private final WorkerService workerService;
    private final JobService jobService;
    private final RepairRequestService repairRequestService;
    private final JobApplicationService jobApplicationService; // ✅ NEW - Add this

    // ========== PROFILE ENDPOINTS ==========

    /**
     * Get worker's own profile
     */
    @GetMapping("/profile")
    public ResponseEntity<WorkerProfileDTO> getMyProfile(
            @AuthenticationPrincipal User user) {

        log.info("Getting profile for worker: {}", user.getId());
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

        log.info("Updating profile for worker: {}", user.getId());
        WorkerProfileDTO updated = workerService.updateProfile(dto, user.getId());
        return ResponseEntity.ok(updated);
    }

    /**
     * Get worker statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<WorkerStats> getStats(
            @AuthenticationPrincipal User user) {

        log.info("Getting stats for worker: {}", user.getId());
        WorkerStats stats = workerService.getWorkerStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    // ========== REPAIR REQUEST ENDPOINTS ==========

    /**
     * Get all open repair requests (for marketplace/main page)
     */
    @GetMapping("/requests/open")
    public ResponseEntity<List<RepairRequest>> getOpenRequests() {
        log.info("📋 Fetching all open repair requests");
        List<RepairRequest> requests = repairRequestService.getOpenRequests();
        log.info("✅ Found {} open repair requests", requests.size());
        return ResponseEntity.ok(requests);
    }

    /**
     * Get a specific repair request by ID
     */
    @GetMapping("/requests/{id}")
    public ResponseEntity<RepairRequest> getRequestById(@PathVariable UUID id) {
        log.info("Getting repair request by ID: {}", id);
        RepairRequest request = repairRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    /**
     * Get repair requests available for this worker (based on skills)
     */
    @GetMapping("/requests/available")
    public ResponseEntity<List<RepairRequest>> getAvailableRequests(
            @AuthenticationPrincipal User user) {

        log.info("Getting available requests for worker: {}", user.getId());
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

        log.info("Getting nearby requests for location: ({}, {}) within {}km", lat, lng, radius);
        List<RepairRequest> requests = workerService.getNearbyRequests(lat, lng, radius, user.getId());
        return ResponseEntity.ok(requests);
    }

    /**
     * ✅ NEW - Apply to a repair request (send application message)
     * POST /api/worker/requests/{requestId}/apply
     */
    @PostMapping("/requests/{requestId}/apply")
    public ResponseEntity<JobApplication> applyToRequest(
            @PathVariable UUID requestId,
            @Valid @RequestBody WorkerApplicationDTO dto,
            @AuthenticationPrincipal User user) {

        log.info("🔨 Worker {} applying to request {}", user.getEmail(), requestId);


        JobApplication application = jobApplicationService.createApplication(
                requestId,
                user.getId(),
                dto
        );

        log.info("✅ Application created successfully: {}", application.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(application);
    }

    /**
     * Accept a repair request (OLD METHOD - might want to deprecate in favor of applications)
     */
    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<JobAssignment> acceptRequest(
            @PathVariable UUID id,
            @Valid @RequestBody AcceptRequestDTO dto,
            @AuthenticationPrincipal User user) {

        log.info("Worker {} accepting request {}", user.getId(), id);
        JobAssignment assignment = jobService.acceptRequest(id, dto, user.getId());
        return ResponseEntity.ok(assignment);
    }

    // ========== APPLICATION ENDPOINTS (NEW) ==========

    /**
     * ✅ NEW - Get all applications sent by this worker
     * GET /api/worker/applications
     */
    @GetMapping("/applications")
    public ResponseEntity<List<JobApplication>> getMyApplications(
            @AuthenticationPrincipal User user) {

        log.info("Fetching applications for worker: {}", user.getEmail());
        List<JobApplication> applications = jobApplicationService.getWorkerApplications(user.getId());
        log.info("Found {} applications", applications.size());

        return ResponseEntity.ok(applications);
    }

    // ========== AVAILABILITY ENDPOINTS ==========

    /**
     * Set worker availability slots
     */
    @PostMapping("/availability")
    public ResponseEntity<List<AvailabilitySlot>> setAvailability(
            @Valid @RequestBody List<AvailabilitySlotDTO> slots,
            @AuthenticationPrincipal User user) {

        log.info("Setting availability for worker {}: {} slots", user.getId(), slots.size());
        List<AvailabilitySlot> saved = workerService.setAvailability(slots, user.getId());
        return ResponseEntity.ok(saved);
    }

    /**
     * Get worker's availability
     */
    @GetMapping("/availability")
    public ResponseEntity<List<AvailabilitySlot>> getAvailability(
            @AuthenticationPrincipal User user) {

        log.info("Getting availability for worker: {}", user.getId());
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

        log.info("Getting jobs for worker: {}", user.getId());
        List<JobAssignment> jobs = jobService.getWorkerJobs(user.getId());
        log.info("Found {} jobs", jobs.size());
        return ResponseEntity.ok(jobs);
    }

    /**
     * Mark a job as complete
     */
    @PostMapping("/jobs/{id}/complete")
    public ResponseEntity<Void> completeJob(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        log.info("Worker {} marking job {} as complete", user.getId(), id);
        jobService.completeJob(id);
        return ResponseEntity.ok().build();
    }

}
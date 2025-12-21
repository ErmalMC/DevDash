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
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
@Slf4j
public class CitizenController {

    private final RepairRequestService requestService;
    private final RatingService ratingService;
    private final JobService jobService;
    private final JobApplicationService jobApplicationService;

    /**
     * ✅ FIXED: Now returns RepairRequest entity
     */
    @PostMapping("/requests")
    public ResponseEntity<RepairRequest> createRequest(
            @Valid @RequestBody CreateRequestDTO dto,
            @AuthenticationPrincipal User user) {

        log.info("📝 Creating repair request for citizen: {}", user.getEmail());
        RepairRequest request = requestService.createRequest(dto, user.getId());
        log.info("✅ Request created with ID: {}", request.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    @GetMapping("/requests/my")
    public ResponseEntity<List<RepairRequest>> getMyRequests(
            @AuthenticationPrincipal User user) {

        log.info("📋 Fetching repair requests for citizen: {}", user.getEmail());
        List<RepairRequest> requests = requestService.getMyCitizenRequests(user.getId());
        log.info("✅ Found {} requests", requests.size());
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<RepairRequest> getMyRequest(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        RepairRequest request = requestService.getRequestById(id);

        // Verify this request belongs to the authenticated citizen
        if (!request.getCitizen().getId().equals(user.getId())) {
            log.error("🚫 Citizen {} tried to access request {} owned by someone else",
                    user.getEmail(), id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(request);
    }

    /**
     * Get all JOB APPLICATIONS for a specific request
     */
    @GetMapping("/requests/{id}/applications")
    public ResponseEntity<List<JobApplication>> getRequestApplications(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        log.info("📬 Fetching applications for request: {} by citizen: {}", id, user.getEmail());

        RepairRequest request = requestService.getRequestById(id);

        // Verify this request belongs to the authenticated citizen
        if (!request.getCitizen().getId().equals(user.getId())) {
            log.error("🚫 Citizen {} tried to access request {} owned by someone else",
                    user.getEmail(), id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<JobApplication> applications = jobApplicationService.getRequestApplications(id);
        log.info("✅ Found {} applications for request {}", applications.size(), id);

        return ResponseEntity.ok(applications);
    }

    /**
     * Accept a worker's application
     */
    @PostMapping("/applications/{applicationId}/accept")
    public ResponseEntity<?> acceptApplication(
            @PathVariable UUID applicationId,
            @AuthenticationPrincipal User user) {

        log.info("✅ Citizen {} accepting application {}", user.getEmail(), applicationId);

        try {
            JobApplication application = jobApplicationService.acceptApplication(applicationId, user.getId());
            log.info("✅ Application accepted successfully");
            return ResponseEntity.ok(application);
        } catch (SecurityException e) {
            log.error("🚫 Security error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ Error accepting application", e);
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Decline a worker's application
     */
    @PostMapping("/applications/{applicationId}/decline")
    public ResponseEntity<?> declineApplication(
            @PathVariable UUID applicationId,
            @AuthenticationPrincipal User user) {

        log.info("❌ Citizen {} declining application {}", user.getEmail(), applicationId);

        try {
            JobApplication application = jobApplicationService.declineApplication(applicationId, user.getId());
            log.info("✅ Application declined successfully");
            return ResponseEntity.ok(application);
        } catch (SecurityException e) {
            log.error("🚫 Security error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("❌ Error declining application", e);
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * Rate a completed job
     */
    @PostMapping("/requests/{id}/rate")
    public ResponseEntity<Rating> rateJob(
            @PathVariable UUID id,
            @Valid @RequestBody RateJobDTO dto,
            @AuthenticationPrincipal User user) {

        Rating rating = ratingService.rateJob(id, dto, user.getId());
        return ResponseEntity.ok(rating);
    }

    // ========== OLD JOB ASSIGNMENT METHODS (Keep for backward compatibility) ==========

    @GetMapping("/assignments/{id}")
    public ResponseEntity<JobAssignment> getAssignment(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        JobAssignment assignment = jobService.getAssignmentById(id);
        RepairRequest request = requestService.getRequestById(assignment.getRepairRequestId());

        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(assignment);
    }

    @PostMapping("/requests/{requestId}/accept/{assignmentId}")
    public ResponseEntity<Void> acceptWorker(
            @PathVariable UUID requestId,
            @PathVariable UUID assignmentId,
            @AuthenticationPrincipal User user) {

        RepairRequest request = requestService.getRequestById(requestId);

        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        jobService.acceptWorkerApplication(requestId, assignmentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/assignments/{id}/decline")
    public ResponseEntity<Void> declineWorker(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        JobAssignment assignment = jobService.getAssignmentById(id);
        RepairRequest request = requestService.getRequestById(assignment.getRepairRequestId());

        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        jobService.declineWorkerApplication(id);
        return ResponseEntity.ok().build();
    }

    // ========== HELPER CLASSES ==========

    @lombok.Data
    @lombok.AllArgsConstructor
    static class ErrorResponse {
        private String error;
    }
}
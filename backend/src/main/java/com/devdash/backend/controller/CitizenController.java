package com.devdash.backend.controller;

import com.devdash.backend.dto.*;
import com.devdash.backend.entity.*;
import com.devdash.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
public class CitizenController {

    private final RepairRequestService requestService;
    private final RatingService ratingService;
    private final JobService jobService; // ADD THIS

    @PostMapping("/requests")
    public ResponseEntity<RepairRequestResponse> createRequest(
            @Valid @RequestBody CreateRequestDTO dto,
            @AuthenticationPrincipal User user) {

        RepairRequestResponse response = requestService.createRequest(dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/requests/my")
    public ResponseEntity<List<RepairRequest>> getMyRequests(
            @AuthenticationPrincipal User user) {

        List<RepairRequest> requests = requestService.getMyCitizenRequests(user.getId());
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/requests/{id}/rate")
    public ResponseEntity<Rating> rateJob(
            @PathVariable UUID id,
            @Valid @RequestBody RateJobDTO dto,
            @AuthenticationPrincipal User user) {

        Rating rating = ratingService.rateJob(id, dto, user.getId());
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<RepairRequest> getMyRequest(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        RepairRequest request = requestService.getRequestById(id); // CHANGED from repairRequestService

        // Verify this request belongs to the authenticated citizen
        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(request);
    }

    /**
     * Get all applications/assignments for a specific request
     */
    @GetMapping("/requests/{id}/applications")
    public ResponseEntity<List<JobAssignment>> getRequestApplications(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        RepairRequest request = requestService.getRequestById(id); // CHANGED from repairRequestService

        // Verify this request belongs to the authenticated citizen
        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<JobAssignment> applications = jobService.getRequestApplications(id);
        return ResponseEntity.ok(applications);
    }

    /**
     * Get a specific job assignment
     */
    @GetMapping("/assignments/{id}")
    public ResponseEntity<JobAssignment> getAssignment(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        JobAssignment assignment = jobService.getAssignmentById(id);

        // Verify this assignment's request belongs to the authenticated citizen
        RepairRequest request = requestService.getRequestById(assignment.getRepairRequestId()); // CHANGED from repairRequestService
        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(assignment);
    }

    /**
     * Accept a worker for a job
     */
    @PostMapping("/requests/{requestId}/accept/{assignmentId}")
    public ResponseEntity<Void> acceptWorker(
            @PathVariable UUID requestId,
            @PathVariable UUID assignmentId,
            @AuthenticationPrincipal User user) {

        RepairRequest request = requestService.getRequestById(requestId); // CHANGED from repairRequestService

        // Verify this request belongs to the authenticated citizen
        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        jobService.acceptWorkerApplication(requestId, assignmentId);
        return ResponseEntity.ok().build();
    }

    /**
     * Decline a worker application
     */
    @PostMapping("/assignments/{id}/decline")
    public ResponseEntity<Void> declineWorker(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        JobAssignment assignment = jobService.getAssignmentById(id);
        RepairRequest request = requestService.getRequestById(assignment.getRepairRequestId()); // CHANGED from repairRequestService

        // Verify this assignment's request belongs to the authenticated citizen
        if (!request.getCitizen().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        jobService.declineWorkerApplication(id);
        return ResponseEntity.ok().build();
    }
}
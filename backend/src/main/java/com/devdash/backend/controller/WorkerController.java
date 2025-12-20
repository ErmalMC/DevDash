package com.repairmatch.controller;

import com.repairmatch.dto.*;
import com.repairmatch.entity.*;
import com.repairmatch.service.*;
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

    @GetMapping("/requests/available")
    public ResponseEntity<List<RepairRequest>> getAvailableRequests(
            @AuthenticationPrincipal User user) {

        List<RepairRequest> requests = workerService.getAvailableRequests(user.getId());
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<JobAssignment> acceptRequest(
            @PathVariable UUID id,
            @Valid @RequestBody AcceptRequestDTO dto,
            @AuthenticationPrincipal User user) {

        JobAssignment assignment = jobService.acceptRequest(id, dto, user.getId());
        return ResponseEntity.ok(assignment);
    }

    @PostMapping("/availability")
    public ResponseEntity<List<AvailabilitySlot>> setAvailability(
            @Valid @RequestBody List<AvailabilitySlotDTO> slots,
            @AuthenticationPrincipal User user) {

        List<AvailabilitySlot> saved = workerService.setAvailability(slots, user.getId());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/jobs/my")
    public ResponseEntity<List<JobAssignment>> getMyJobs(
            @AuthenticationPrincipal User user) {

        List<JobAssignment> jobs = jobService.getWorkerJobs(user.getId());
        return ResponseEntity.ok(jobs);
    }

    @PostMapping("/jobs/{id}/complete")
    public ResponseEntity<Void> completeJob(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {

        jobService.completeJob(id);
        return ResponseEntity.ok().build();
    }
}
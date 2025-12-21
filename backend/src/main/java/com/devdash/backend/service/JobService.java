package com.devdash.backend.service;

import com.devdash.backend.dto.AcceptRequestDTO;
import com.devdash.backend.entity.*;
import com.devdash.backend.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobAssignmentRepository assignmentRepo;
    private final RepairRequestRepository requestRepo;
    private final WorkerProfileRepository workerRepo;

    public JobAssignment acceptRequest(UUID requestId, @Valid AcceptRequestDTO dto, UUID userId) {
        RepairRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new IllegalStateException("Request not found"));

        if (request.getStatus() != RequestStatus.OPEN) {
            throw new IllegalStateException("Request is no longer available");
        }

        WorkerProfile worker = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        if (!worker.getIsApproved()) {
            throw new IllegalStateException("Worker not approved");
        }

        // Validate worker has the required skill
        if (!worker.getSkills().contains(request.getCategory().name())) {
            throw new IllegalStateException("Worker doesn't have required skill");
        }

        // Update request status to MATCHED (when worker applies)
        request.setStatus(RequestStatus.MATCHED);
        requestRepo.save(request);

        // Create assignment
        JobAssignment assignment = JobAssignment.builder()
                .repairRequest(request)
                .worker(worker)
                .scheduledStart(dto.getScheduledStart())
                .scheduledEnd(dto.getScheduledEnd())
                .finalPrice(dto.getEstimatedPrice().doubleValue())
                .build();

        assignment = assignmentRepo.save(assignment);
        log.info("Worker {} accepted request {}", worker.getId(), requestId);

        return assignment;
    }

    @Transactional(readOnly = true)
    public List<JobAssignment> getWorkerJobs(UUID userId) {
        WorkerProfile worker = workerRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Worker profile not found"));

        return assignmentRepo.findByWorkerId(worker.getId());
    }

    public void completeJob(UUID requestId) {
        RepairRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new IllegalStateException("Request not found"));

        request.setStatus(RequestStatus.COMPLETED);
        requestRepo.save(request);
        log.info("Job completed: {}", requestId);
    }

    /**
     * Get all applications for a repair request
     */
    @Transactional(readOnly = true)
    public List<JobAssignment> getRequestApplications(UUID requestId) {
        // Use the new method that returns List instead of Optional
        return assignmentRepo.findAllByRepairRequestId(requestId);
    }

    /**
     * Get a specific job assignment by ID
     */
    @Transactional(readOnly = true)
    public JobAssignment getAssignmentById(UUID assignmentId) {
        return assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new IllegalStateException("Assignment not found"));
    }

    /**
     * Accept a worker's application (citizen accepts worker)
     */
    public void acceptWorkerApplication(UUID requestId, UUID assignmentId) {
        RepairRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new IllegalStateException("Request not found"));

        JobAssignment acceptedAssignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new IllegalStateException("Assignment not found"));

        // Update request status to IN_PROGRESS (citizen accepted worker)
        request.setStatus(RequestStatus.IN_PROGRESS);
        requestRepo.save(request);

        // Get all applications for this request and delete the others
        List<JobAssignment> allApplications = assignmentRepo.findAllByRepairRequestId(requestId);

        for (JobAssignment app : allApplications) {
            if (!app.getId().equals(assignmentId)) {
                // Delete other applications
                assignmentRepo.delete(app);
            }
        }

        log.info("Citizen accepted worker {} for request {}",
                acceptedAssignment.getWorker().getId(), requestId);
    }

    /**
     * Decline a worker's application
     */
    public void declineWorkerApplication(UUID assignmentId) {
        JobAssignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new IllegalStateException("Assignment not found"));

        assignmentRepo.delete(assignment);
        log.info("Worker application {} declined", assignmentId);
    }
}
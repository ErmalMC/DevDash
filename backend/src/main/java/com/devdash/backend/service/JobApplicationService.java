package com.devdash.backend.service;

import com.devdash.backend.dto.WorkerApplicationDTO;
import com.devdash.backend.entity.*;
import com.devdash.backend.exception.ConflictException;
import com.devdash.backend.exception.ForbiddenOperationException;
import com.devdash.backend.exception.ResourceNotFoundException;
import com.devdash.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final UserRepository userRepository;

    /**
     * Create a new job application
     */
    @Transactional
    public JobApplication createApplication(UUID repairRequestId, UUID workerId, WorkerApplicationDTO dto) {
        // Get repair request
        RepairRequest request = repairRequestRepository.findById(repairRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Repair request not found"));

        // Check if request is still open
        if (request.getStatus() != RequestStatus.OPEN) {
            throw new ConflictException("This repair request is no longer accepting applications");
        }

        // Get worker
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        // Verify user is a worker
        if (worker.getRole() != UserRole.WORKER) {
            throw new ForbiddenOperationException("Only workers can apply to repair requests");
        }

        // Check if worker already applied
        if (applicationRepository.existsByRepairRequestIdAndWorkerId(repairRequestId, workerId)) {
            throw new ConflictException("You have already applied to this request");
        }

        // Create application
        JobApplication application = JobApplication.builder()
                .repairRequest(request)
                .worker(worker)
                .message(dto.getMessage())
                .proposedPrice(dto.getProposedPrice())
                .estimatedDuration(dto.getEstimatedDuration())
                .status(ApplicationStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return applicationRepository.save(application);
    }

    /**
     * Check if worker has already applied to this request
     */
    public boolean hasWorkerApplied(UUID repairRequestId, UUID workerId) {
        return applicationRepository.existsByRepairRequestIdAndWorkerId(repairRequestId, workerId);
    }

    /**
     * Get all applications for a repair request
     */
    public List<JobApplication> getRequestApplications(UUID repairRequestId) {
        return applicationRepository.findByRepairRequestIdOrderByCreatedAtDesc(repairRequestId);
    }

    /**
     * Get all applications by a worker
     */
    public List<JobApplication> getWorkerApplications(UUID workerId) {
        return applicationRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
    }

    /**
     * Accept an application
     */
    @Transactional
    public JobApplication acceptApplication(UUID applicationId, UUID citizenId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        // Verify the repair request belongs to this citizen
        if (!application.getRepairRequest().getCitizen().getId().equals(citizenId)) {
            throw new ForbiddenOperationException("You don't have permission to accept this application");
        }

        // Check if application is still pending
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ConflictException("This application has already been " + application.getStatus().toString().toLowerCase());
        }

        // Update application status
        application.setStatus(ApplicationStatus.ACCEPTED);
        application.setRespondedAt(LocalDateTime.now());

        // Update repair request status to ASSIGNED
        RepairRequest request = application.getRepairRequest();
        request.setStatus(RequestStatus.ASSIGNED);
        repairRequestRepository.save(request);

        // TODO: Optionally decline all other pending applications for this request
        // declineOtherApplications(application.getRepairRequest().getId(), applicationId);

        return applicationRepository.save(application);
    }

    /**
     * Decline an application
     */
    @Transactional
    public JobApplication declineApplication(UUID applicationId, UUID citizenId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        // Verify the repair request belongs to this citizen
        if (!application.getRepairRequest().getCitizen().getId().equals(citizenId)) {
            throw new ForbiddenOperationException("You don't have permission to decline this application");
        }

        // Check if application is still pending
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new ConflictException("This application has already been " + application.getStatus().toString().toLowerCase());
        }

        // Update application status
        application.setStatus(ApplicationStatus.DECLINED);
        application.setRespondedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    /**
     * Helper method to decline all other applications when one is accepted
     */
    private void declineOtherApplications(UUID repairRequestId, UUID acceptedApplicationId) {
        List<JobApplication> pendingApplications = applicationRepository
                .findByRepairRequestIdOrderByCreatedAtDesc(repairRequestId)
                .stream()
                .filter(app -> app.getStatus() == ApplicationStatus.PENDING
                        && !app.getId().equals(acceptedApplicationId))
                .toList();

        for (JobApplication app : pendingApplications) {
            app.setStatus(ApplicationStatus.DECLINED);
            app.setRespondedAt(LocalDateTime.now());
            applicationRepository.save(app);
        }

        log.info("Auto-declined {} other applications for request {}",
                pendingApplications.size(), repairRequestId);
    }
}
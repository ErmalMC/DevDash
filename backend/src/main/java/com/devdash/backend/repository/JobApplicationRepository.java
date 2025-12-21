package com.devdash.backend.repository;

import com.devdash.backend.entity.ApplicationStatus;
import com.devdash.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    /**
     * Find all applications for a specific repair request
     */
    List<JobApplication> findByRepairRequestIdOrderByCreatedAtDesc(UUID repairRequestId);

    /**
     * Find all applications by a specific worker
     */
    List<JobApplication> findByWorkerIdOrderByCreatedAtDesc(UUID workerId);

    /**
     * Check if worker already applied to this request
     */
    boolean existsByRepairRequestIdAndWorkerId(UUID repairRequestId, UUID workerId);

    /**
     * Find a specific application
     */
    Optional<JobApplication> findByIdAndRepairRequestId(UUID applicationId, UUID repairRequestId);

    /**
     * Count pending applications for a repair request
     */
    long countByRepairRequestIdAndStatus(UUID repairRequestId, ApplicationStatus status);
}
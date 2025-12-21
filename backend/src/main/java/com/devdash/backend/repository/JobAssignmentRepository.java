// Add this method to your JobAssignmentRepository.java

package com.devdash.backend.repository;

import com.devdash.backend.entity.JobAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobAssignmentRepository extends JpaRepository<JobAssignment, UUID> {

    // EXISTING METHODS (you already have these)
    Optional<JobAssignment> findByRepairRequestId(UUID repairRequestId);
    List<JobAssignment> findByWorkerId(UUID workerId);

    @Query("SELECT j FROM JobAssignment j WHERE j.worker.id = :workerId " +
            "AND j.scheduledStart >= :start AND j.scheduledEnd <= :end")
    List<JobAssignment> findWorkerJobsInRange(
            @Param("workerId") UUID workerId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // NEW METHOD NEEDED (Add this if you don't have it):

    /**
     * Find all job assignments for a specific repair request
     * This returns ALL workers who applied to this request
     */
    @Query("SELECT j FROM JobAssignment j WHERE j.repairRequest.id = :requestId")
    List<JobAssignment> findAllByRepairRequestId(@Param("requestId") UUID requestId);
}

// EXPLANATION:
// Your existing findByRepairRequestId returns Optional<JobAssignment> (single result)
// The new findAllByRepairRequestId returns List<JobAssignment> (multiple results)
// Use findAllByRepairRequestId when you need all applications for a request
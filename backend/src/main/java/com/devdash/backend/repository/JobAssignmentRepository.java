package com.repairmatch.repository;

import com.repairmatch.entity.JobAssignment;
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
    Optional<JobAssignment> findByRepairRequestId(UUID repairRequestId);
    List<JobAssignment> findByWorkerId(UUID workerId);

    @Query("SELECT j FROM JobAssignment j WHERE j.worker.id = :workerId " +
            "AND j.scheduledStart >= :start AND j.scheduledEnd <= :end")
    List<JobAssignment> findWorkerJobsInRange(
            @Param("workerId") UUID workerId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
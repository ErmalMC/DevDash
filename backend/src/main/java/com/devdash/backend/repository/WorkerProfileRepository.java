package com.devdash.backend.repository;

import com.devdash.backend.entity.SkillCategory;
import com.devdash.backend.entity.WorkerProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, UUID> {

    // ========== EXISTING METHODS ==========

    /**
     * Find worker profile by user ID
     */
    Optional<WorkerProfile> findByUserId(UUID userId);

    /**
     * Find all approved workers
     */
    List<WorkerProfile> findByIsApprovedTrue();

    /**
     * Find approved workers by skill
     */
    @Query("SELECT w FROM WorkerProfile w WHERE w.isApproved = true " +
            "AND :skill MEMBER OF w.skills")
    List<WorkerProfile> findApprovedWorkersBySkill(@Param("skill") SkillCategory skill);

    // ========== NEW METHODS FOR PUBLIC ENDPOINTS ==========

    /**
     * Find approved workers ordered by rating (for top workers)
     * Used by: GET /api/public/workers/top
     */
    @Query("SELECT w FROM WorkerProfile w WHERE w.isApproved = :approved " +
            "ORDER BY w.ratingAverage DESC NULLS LAST")
    List<WorkerProfile> findByIsApprovedOrderByRatingAverageDesc(
            @Param("approved") Boolean isApproved,
            Pageable pageable
    );

    /**
     * Find approved workers with pagination
     * Used by: GET /api/public/workers/search (without skill filter)
     */
    @Query("SELECT w FROM WorkerProfile w WHERE w.isApproved = :approved")
    List<WorkerProfile> findByIsApproved(
            @Param("approved") Boolean isApproved,
            Pageable pageable
    );

    /**
     * Find approved workers by skill with pagination
     * Used by: GET /api/public/workers/search?skill=ELECTRICAL
     */
    @Query("SELECT w FROM WorkerProfile w WHERE w.isApproved = :approved " +
            "AND :skill MEMBER OF w.skills")
    List<WorkerProfile> findByIsApprovedAndSkillsContaining(
            @Param("approved") Boolean isApproved,
            @Param("skill") String skill,
            Pageable pageable
    );
}
package com.repairmatch.repository;

import com.repairmatch.entity.SkillCategory;
import com.repairmatch.entity.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, UUID> {
    Optional<WorkerProfile> findByUserId(UUID userId);
    List<WorkerProfile> findByIsApprovedTrue();

    @Query("SELECT w FROM WorkerProfile w WHERE w.isApproved = true " +
            "AND :skill MEMBER OF w.skills")
    List<WorkerProfile> findApprovedWorkersBySkill(@Param("skill") SkillCategory skill);
}
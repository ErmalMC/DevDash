package com.devdash.backend.repository;

import com.devdash.backend.entity.RepairRequest;
import com.devdash.backend.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, UUID> {
    List<RepairRequest> findByCitizenId(UUID citizenId);
    List<RepairRequest> findByStatus(RequestStatus status);

    @Query("SELECT r FROM RepairRequest r WHERE r.status = 'OPEN' " +
            "ORDER BY r.urgency DESC, r.createdAt ASC")
    List<RepairRequest> findOpenRequestsByPriority();
}
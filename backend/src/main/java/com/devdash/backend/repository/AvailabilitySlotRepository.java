package com.devdash.backend.repository;

import com.devdash.backend.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {
    List<AvailabilitySlot> findByWorkerId(UUID workerId);

    @Query("SELECT a FROM AvailabilitySlot a WHERE a.worker.id = :workerId " +
            "AND a.dayOfWeek = :day")
    List<AvailabilitySlot> findByWorkerAndDay(
            @Param("workerId") UUID workerId,
            @Param("day") DayOfWeek day
    );

    void deleteByWorkerId(UUID workerId);
}

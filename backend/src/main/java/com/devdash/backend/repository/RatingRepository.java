package com.repairmatch.repository;

import com.repairmatch.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<Rating, UUID> {
    Optional<Rating> findByRepairRequestId(UUID repairRequestId);
    List<Rating> findByWorkerId(UUID workerId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.worker.id = :workerId")
    Double calculateAverageRating(@Param("workerId") UUID workerId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.worker.id = :workerId")
    Integer countByWorkerId(@Param("workerId") UUID workerId);
}

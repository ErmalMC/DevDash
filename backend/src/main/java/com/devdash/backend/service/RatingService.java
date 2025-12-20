package com.devdash.backend.service;

import com.devdash.backend.entity.RateJobDTO;
import com.devdash.backend.entity.*;
import com.devdash.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepo;
    private final RepairRequestRepository requestRepo;
    private final JobAssignmentRepository assignmentRepo;
    private final WorkerProfileRepository workerRepo;
    private final UserRepository userRepo;

    public Rating rateJob(UUID requestId, RateJobDTO dto, UUID citizenId) {
        RepairRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new IllegalStateException("Request not found"));

        if (request.getStatus() != RequestStatus.COMPLETED) {
            throw new IllegalStateException("Can only rate completed jobs");
        }

        if (!request.getCitizen().getId().equals(citizenId)) {
            throw new IllegalStateException("Not authorized to rate this job");
        }

        // Check if already rated
        if (ratingRepo.findByRepairRequestId(requestId).isPresent()) {
            throw new IllegalStateException("Job already rated");
        }

        JobAssignment assignment = assignmentRepo.findByRepairRequestId(requestId)
                .orElseThrow(() -> new IllegalStateException("Job assignment not found"));

        User citizen = userRepo.findById(citizenId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Create rating
        Rating rating = Rating.builder()
                .repairRequest(request)
                .citizen(citizen)
                .worker(assignment.getWorker())
                .score(dto.getScore())
                .comment(dto.getComment())
                .build();

        rating = ratingRepo.save(rating);

        // Update worker's average rating
        updateWorkerRating(assignment.getWorker().getId());

        log.info("Rating created for request {}: {} stars", requestId, dto.getScore());
        return rating;
    }

    private void updateWorkerRating(UUID workerId) {
        Double avgRating = ratingRepo.calculateAverageRating(workerId);
        Integer count = ratingRepo.countByWorkerId(workerId);

        WorkerProfile worker = workerRepo.findById(workerId)
                .orElseThrow(() -> new IllegalStateException("Worker not found"));

        worker.setRatingAverage(avgRating != null ? avgRating : 0.0);
        worker.setRatingCount(count != null ? count : 0);

        workerRepo.save(worker);
    }
}
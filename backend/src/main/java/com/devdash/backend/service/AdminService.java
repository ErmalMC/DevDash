package com.repairmatch.service;

import com.repairmatch.entity.WorkerProfile;
import com.repairmatch.repository.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final WorkerProfileRepository workerRepo;

    public WorkerProfile approveWorker(UUID workerId) {
        WorkerProfile worker = workerRepo.findById(workerId)
                .orElseThrow(() -> new IllegalStateException("Worker not found"));

        worker.setIsApproved(true);
        worker = workerRepo.save(worker);

        log.info("Worker approved: {} ({})", worker.getUser().getFullName(), workerId);
        return worker;
    }
}

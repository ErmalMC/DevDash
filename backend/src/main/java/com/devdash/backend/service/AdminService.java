package com.devdash.backend.service;

import com.devdash.backend.entity.WorkerProfile;
import com.devdash.backend.repository.WorkerProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final WorkerProfileRepository workerRepo;

    // Manual constructor instead of @RequiredArgsConstructor
    public AdminService(WorkerProfileRepository workerRepo) {
        this.workerRepo = workerRepo;
    }

    public WorkerProfile approveWorker(UUID workerId) {
        WorkerProfile worker = workerRepo.findById(workerId)
                .orElseThrow(() -> new IllegalStateException("Worker not found"));

        worker.setIsApproved(true);
        worker = workerRepo.save(worker);

        log.info("Worker approved: {} ({})", worker.getUser().getFullName(), workerId);
        return worker;
    }
}
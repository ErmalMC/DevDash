package com.repairmatch.service;

import com.repairmatch.dto.*;
import com.repairmatch.entity.*;
import com.repairmatch.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RepairRequestService {

    private final RepairRequestRepository requestRepo;
    private final UserRepository userRepo;
    private final MatchingService matchingService;

    public RepairRequestResponse createRequest(CreateRequestDTO dto, UUID citizenId) {
        User citizen = userRepo.findById(citizenId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (citizen.getRole() != UserRole.CITIZEN) {
            throw new IllegalStateException("Only citizens can create requests");
        }

        RepairRequest request = RepairRequest.builder()
                .citizen(citizen)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .urgency(dto.getUrgency())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .status(RequestStatus.OPEN)
                .build();

        request = requestRepo.save(request);
        log.info("Created repair request: {}", request.getId());

        // Auto-match workers
        List<WorkerMatchDTO> matches = matchingService.findMatchingWorkers(request);

        String message = matches.isEmpty()
                ? "No workers available. Request created and will be visible when workers come online."
                : String.format("%d worker(s) notified and can accept your request", matches.size());

        return RepairRequestResponse.builder()
                .requestId(request.getId())
                .status(request.getStatus())
                .matchedWorkers(matches)
                .message(message)
                .build();
    }

    @Transactional(readOnly = true)
    public List<RepairRequest> getMyCitizenRequests(UUID citizenId) {
        return requestRepo.findByCitizenId(citizenId);
    }

    @Transactional(readOnly = true)
    public RepairRequest getRequestById(UUID id) {
        return requestRepo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Request not found"));
    }
}
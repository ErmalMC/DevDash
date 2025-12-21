package com.devdash.backend.service;

import com.devdash.backend.dto.CreateRequestDTO;
import com.devdash.backend.dto.RepairRequestResponse;
import com.devdash.backend.entity.RepairRequest;
import com.devdash.backend.entity.RequestStatus;
import com.devdash.backend.entity.User;
import com.devdash.backend.repository.RepairRequestRepository;
import com.devdash.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RepairRequestService {

    private final RepairRequestRepository repairRequestRepository;
    private final UserRepository userRepository;

    /**
     * ✅ FIXED: Create a new repair request and return the full entity
     * This ensures the citizen relationship is included
     */
    @Transactional
    public RepairRequest createRequest(CreateRequestDTO dto, UUID citizenId) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RepairRequest request = RepairRequest.builder()
                .citizen(citizen)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .urgency(dto.getUrgency())
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .status(RequestStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        // ✅ Return the saved entity directly with citizen relationship
        return repairRequestRepository.save(request);
    }

    /**
     * Get all open repair requests
     */
    @Transactional(readOnly = true)
    public List<RepairRequest> getOpenRequests() {
        return repairRequestRepository.findByStatus(RequestStatus.OPEN);
    }

    /**
     * Get a specific repair request by ID
     */
    @Transactional(readOnly = true)
    public RepairRequest getRequestById(UUID id) {
        return repairRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Repair request not found"));
    }

    /**
     * Get all repair requests for a specific citizen
     */
    @Transactional(readOnly = true)
    public List<RepairRequest> getMyCitizenRequests(UUID citizenId) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        return repairRequestRepository.findByCitizenOrderByCreatedAtDesc(citizen);
    }

    /**
     * Update request status
     */
    @Transactional
    public RepairRequest updateStatus(UUID requestId, RequestStatus newStatus) {
        RepairRequest request = repairRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Repair request not found"));

        request.setStatus(newStatus);
        return repairRequestRepository.save(request);
    }

    /**
     * ✅ KEPT for backward compatibility if needed elsewhere
     * Helper method to map entity to response DTO
     */
    @Deprecated
    private RepairRequestResponse mapToResponse(RepairRequest request) {
        return RepairRequestResponse.builder()
                .id(request.getId())
                .requestId(request.getId())
                .category(request.getCategory().name())
                .description(request.getDescription())
                .urgency(request.getUrgency().name())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus().toString())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
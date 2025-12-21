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
     * Create a new repair request
     */
    @Transactional
    public RepairRequestResponse createRequest(CreateRequestDTO dto, UUID citizenId) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RepairRequest request = RepairRequest.builder()
                .citizen(citizen)
                .category(dto.getCategory())  // SkillCategory enum
                .description(dto.getDescription())
                .urgency(dto.getUrgency())  // Urgency enum
                .address(dto.getAddress())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .status(RequestStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        RepairRequest saved = repairRequestRepository.save(request);

        return mapToResponse(saved);
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
        return repairRequestRepository.findByCitizenId(citizenId);  // Use existing method
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

    // Helper method to map entity to response DTO
    private RepairRequestResponse mapToResponse(RepairRequest request) {
        return RepairRequestResponse.builder()
                .id(request.getId())
                .requestId(request.getId())
                .category(request.getCategory().name())  // Convert SkillCategory enum to String
                .description(request.getDescription())
                .urgency(request.getUrgency().name())  // Convert Urgency enum to String
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus().toString())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
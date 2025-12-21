package com.devdash.backend.dto;

import com.devdash.backend.entity.RequestStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepairRequestResponse {
    private UUID id;
    private UUID requestId; // For backward compatibility
    private String category;
    private String description;
    private String urgency;
    private String address;
    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime createdAt;
    private List<WorkerMatchDTO> matchedWorkers;
    private String message;

    // Constructor for backward compatibility
    public RepairRequestResponse(UUID requestId, RequestStatus status,
                                 List<WorkerMatchDTO> matchedWorkers, String message) {
        this.requestId = requestId;
        this.id = requestId;
        this.status = status != null ? status.toString() : null;
        this.matchedWorkers = matchedWorkers;
        this.message = message;
    }
}
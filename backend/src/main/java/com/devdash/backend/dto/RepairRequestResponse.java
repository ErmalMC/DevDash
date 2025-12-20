package com.devdash.backend.dto;

import com.devdash.backend.entity.RequestStatus;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class RepairRequestResponse {
    private UUID requestId;
    private RequestStatus status;
    private List<WorkerMatchDTO> matchedWorkers;
    private String message;
}
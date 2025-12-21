package com.devdash.backend.entity;

/**
 * Status of a worker's application to a repair request
 */
public enum ApplicationStatus {
    PENDING,    // Worker sent application, waiting for citizen response
    ACCEPTED,   // Citizen accepted this worker
    DECLINED    // Citizen declined this worker
}
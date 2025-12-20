package com.repairmatch.controller;

import com.repairmatch.dto.*;
import com.repairmatch.entity.*;
import com.repairmatch.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CitizenController {

    private final RepairRequestService requestService;
    private final RatingService ratingService;

    @PostMapping("/requests")
    public ResponseEntity<RepairRequestResponse> createRequest(
            @Valid @RequestBody CreateRequestDTO dto,
            @AuthenticationPrincipal User user) {

        RepairRequestResponse response = requestService.createRequest(dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/requests/my")
    public ResponseEntity<List<RepairRequest>> getMyRequests(
            @AuthenticationPrincipal User user) {

        List<RepairRequest> requests = requestService.getMyCitizenRequests(user.getId());
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/requests/{id}/rate")
    public ResponseEntity<Rating> rateJob(
            @PathVariable UUID id,
            @Valid @RequestBody RateJobDTO dto,
            @AuthenticationPrincipal User user) {

        Rating rating = ratingService.rateJob(id, dto, user.getId());
        return ResponseEntity.ok(rating);
    }
}
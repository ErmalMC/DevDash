package com.repairmatch.controller;

import com.repairmatch.entity.WorkerProfile;
import com.repairmatch.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/workers/{id}/approve")
    public ResponseEntity<WorkerProfile> approveWorker(@PathVariable UUID id) {
        WorkerProfile profile = adminService.approveWorker(id);
        return ResponseEntity.ok(profile);
    }
}
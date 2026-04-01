package com.devdash.backend.controller;

import com.devdash.backend.entity.WorkerProfile;
import com.devdash.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    // Manual constructor injection - no Lombok needed
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/workers/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkerProfile> approveWorker(@PathVariable UUID id) {
        WorkerProfile profile = adminService.approveWorker(id);
        return ResponseEntity.ok(profile);
    }
}
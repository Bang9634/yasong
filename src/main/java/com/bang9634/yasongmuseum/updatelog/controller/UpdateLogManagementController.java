package com.bang9634.yasongmuseum.updatelog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.updatelog.dto.CreateUpdateLogRequest;
import com.bang9634.yasongmuseum.updatelog.dto.UpdateLogResponse;
import com.bang9634.yasongmuseum.updatelog.dto.UpdateUpdateLogRequest;
import com.bang9634.yasongmuseum.updatelog.service.UpdateLogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Update Log Management Controller
 * Admin endpoints for managing website update history.
 */
@RestController
@RequestMapping("/api/management/updates")
@RequiredArgsConstructor
public class UpdateLogManagementController {

    private final UpdateLogService updateLogService;

    /**
     * Get update logs with pagination (Admin)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<UpdateLogResponse>> getUpdateLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        PagedResponse<UpdateLogResponse> response = updateLogService.getUpdateLogs(page, limit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UpdateLogResponse> getUpdateLog(@PathVariable Long id) {
        UpdateLogResponse response = updateLogService.getUpdateLogById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<UpdateLogResponse> createUpdateLog(
            @Valid @RequestBody CreateUpdateLogRequest request) {
        UpdateLogResponse response = updateLogService.createUpdateLog(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UpdateLogResponse> updateUpdateLog(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUpdateLogRequest request) {
        UpdateLogResponse response = updateLogService.updateUpdateLog(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUpdateLog(@PathVariable Long id) {
        updateLogService.deleteUpdateLog(id);
        return ResponseEntity.noContent().build();
    }
}

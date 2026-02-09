package com.bang9634.yasongmuseum.updatelog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.updatelog.dto.UpdateLogResponse;
import com.bang9634.yasongmuseum.updatelog.service.UpdateLogService;

import lombok.RequiredArgsConstructor;

/**
 * Update Log Controller
 * Public endpoints for fetching website update history.
 */
@RestController
@RequestMapping("/api/updates")
@RequiredArgsConstructor
public class UpdateLogController {

    private final UpdateLogService updateLogService;
    
    /**
     * Get update logs with pagination (Public)
     * Includes full content for preview
     * 
     * @param page Page number (1-based)
     * @param limit Items per page
     */
    @GetMapping
    public ResponseEntity<PagedResponse<UpdateLogResponse>> getUpdateLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        PagedResponse<UpdateLogResponse> response = updateLogService.getUpdateLogs(page, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Get update log by ID (Public)
     */
    @GetMapping("/{id}")
    public ResponseEntity<UpdateLogResponse> getUpdateLog(@PathVariable Long id) {
        UpdateLogResponse response = updateLogService.getUpdateLogById(id);
        return ResponseEntity.ok(response);
    }
}

package com.bang9634.yasongmuseum.contest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.contest.dto.ContestResponse;
import com.bang9634.yasongmuseum.contest.dto.CreateContestRequest;
import com.bang9634.yasongmuseum.contest.dto.UpdateContestRequest;
import com.bang9634.yasongmuseum.contest.service.ContestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Contest Management Controller
 * Admin endpoints for managing contests.
 */
@RestController
@RequestMapping("/api/management/contests")
@RequiredArgsConstructor
public class ContestManagementController {

    private final ContestService contestService;

    /**
     * Get contests with pagination (Admin API)
     * 
     * @param page Page number (1-based)
     * @param limit Items per page
     * @param search Search keyword (title, description, host, location)
     * @param status Contest status filter (ongoing, upcoming, past)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<ContestResponse>> getContests(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {
        PagedResponse<ContestResponse> response = contestService.getContests(page, limit, search, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContestResponse> getContest(@PathVariable Long id) {
        ContestResponse contest = contestService.getContestById(id);
        return ResponseEntity.ok(contest);
    }

    /**
     * Create new contest (Admin only)
     * Multipart form data with JSON and image file
     */
    @PostMapping
    public ResponseEntity<ContestResponse> createContest(
            @RequestPart("data") @Valid CreateContestRequest request,
            @RequestPart("image") MultipartFile imageFile) {
        ContestResponse contest = contestService.createContest(request, imageFile);
        return ResponseEntity.ok(contest);
    }

    /**
     * Update contest (Admin only)
     * Image file is optional - if not provided, keeps existing image
     */
    @PutMapping("/{id}")
    public ResponseEntity<ContestResponse> updateContest(
            @PathVariable Long id,
            @RequestPart("data") @Valid UpdateContestRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        ContestResponse contest = contestService.updateContest(id, request, imageFile);
        return ResponseEntity.ok(contest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContest(@PathVariable Long id) {
        contestService.deleteContest(id);
        return ResponseEntity.noContent().build();
    }
}

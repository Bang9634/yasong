package com.bang9634.yasongmuseum.contest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.contest.dto.ContestResponse;
import com.bang9634.yasongmuseum.contest.service.ContestService;

import lombok.RequiredArgsConstructor;

/**
 * Contest Controller
 * Public endpoints for fetching contests.
 */
@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
public class ContestController {

    private final ContestService contestService;
    
    /**
     * Get contests with pagination (Public API)
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
}

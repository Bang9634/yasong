package com.bang9634.yasongmuseum.exhibition.controller;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.exhibition.dto.ExhibitionResponse;
import com.bang9634.yasongmuseum.exhibition.service.ExhibitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exhibitions")
@RequiredArgsConstructor
public class ExhibitionController {

    private final ExhibitionService exhibitionService;

    /**
     * Get exhibitions with pagination (Public API)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<ExhibitionResponse>> getExhibitions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status  // ongoing, upcoming, past
    ) {
        PagedResponse<ExhibitionResponse> response = exhibitionService.getExhibitions(page, limit, search, status);
        return ResponseEntity.ok(response);
    }

    /**
     * Get exhibition by ID (Public API)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExhibitionResponse> getExhibitionById(@PathVariable Long id) {
        ExhibitionResponse exhibition = exhibitionService.getExhibitionById(id);
        return ResponseEntity.ok(exhibition);
    }
}

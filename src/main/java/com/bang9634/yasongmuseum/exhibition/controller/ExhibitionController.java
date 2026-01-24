package com.bang9634.yasongmuseum.exhibition.controller;

import com.bang9634.yasongmuseum.exhibition.dto.ExhibitionResponse;
import com.bang9634.yasongmuseum.exhibition.service.ExhibitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
@RequiredArgsConstructor
public class ExhibitionController {

    private final ExhibitionService exhibitionService;

    /**
     * Get all exhibitions (Public API)
     */
    @GetMapping
    public ResponseEntity<List<ExhibitionResponse>> getAllExhibitions() {
        List<ExhibitionResponse> exhibitions = exhibitionService.getAllExhibitions();
        return ResponseEntity.ok(exhibitions);
    }

    /**
     * Get ongoing exhibitions (Public API)
     */
    @GetMapping("/ongoing")
    public ResponseEntity<List<ExhibitionResponse>> getOngoingExhibitions() {
        List<ExhibitionResponse> exhibitions = exhibitionService.getOngoingExhibitions();
        return ResponseEntity.ok(exhibitions);
    }

    /**
     * Get upcoming exhibitions (Public API)
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<ExhibitionResponse>> getUpcomingExhibitions() {
        List<ExhibitionResponse> exhibitions = exhibitionService.getUpcomingExhibitions();
        return ResponseEntity.ok(exhibitions);
    }

    /**
     * Get past exhibitions (Public API)
     */
    @GetMapping("/past")
    public ResponseEntity<List<ExhibitionResponse>> getPastExhibitions() {
        List<ExhibitionResponse> exhibitions = exhibitionService.getPastExhibitions();
        return ResponseEntity.ok(exhibitions);
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

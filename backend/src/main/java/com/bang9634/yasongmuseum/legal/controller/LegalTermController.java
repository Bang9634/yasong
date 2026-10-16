package com.bang9634.yasongmuseum.legal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.legal.dto.LegalTermResponse;
import com.bang9634.yasongmuseum.legal.dto.LegalTermSummaryResponse;
import com.bang9634.yasongmuseum.legal.entity.TermType;
import com.bang9634.yasongmuseum.legal.service.LegalTermService;

import lombok.RequiredArgsConstructor;

/**
 * Legal Term Controller
 * Public endpoints for fetching terms and privacy policies.
 */
@RestController
@RequestMapping("/api/legal")
@RequiredArgsConstructor
public class LegalTermController {

    private final LegalTermService legalTermService;
    
    /**
     * Get term by ID (Public)
     * Allows users to view historical versions with full content
     */
    @GetMapping("/{id}")
    public ResponseEntity<LegalTermResponse> getTerm(@PathVariable Long id) {
        LegalTermResponse response = legalTermService.getTermById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get currently active term by type
     * @param type TERMS_OF_SERVICE or PRIVACY_POLICY
     */
    @GetMapping("/type/{type}/current")
    public ResponseEntity<LegalTermResponse> getCurrentTerm(@PathVariable TermType type) {
        LegalTermResponse response = legalTermService.getCurrentTerm(type);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all historical versions by type (without content)
     * @param type TERMS_OF_SERVICE or PRIVACY_POLICY
     */
    @GetMapping("/type/{type}/history")
    public ResponseEntity<List<LegalTermSummaryResponse>> getTermHistory(@PathVariable TermType type) {
        List<LegalTermSummaryResponse> response = legalTermService.getTermHistory(type);
        return ResponseEntity.ok(response);
    }
}

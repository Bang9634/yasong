package com.bang9634.yasongmuseum.legal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.legal.dto.CreateLegalTermRequest;
import com.bang9634.yasongmuseum.legal.dto.LegalTermResponse;
import com.bang9634.yasongmuseum.legal.dto.UpdateLegalTermRequest;
import com.bang9634.yasongmuseum.legal.service.LegalTermService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Legal Term Management Controller
 * Admin endpoints for managing terms and privacy policies.
 */
@RestController
@RequestMapping("/api/management/legal")
@RequiredArgsConstructor
public class LegalTermManagementController {

    private final LegalTermService legalTermService;

    @GetMapping("/{id}")
    public ResponseEntity<LegalTermResponse> getTerm(@PathVariable Long id) {
        LegalTermResponse response = legalTermService.getTermById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Create new legal term
     * Automatically deactivates previous active term of the same type
     */
    @PostMapping
    public ResponseEntity<LegalTermResponse> createTerm(
            @Valid @RequestBody CreateLegalTermRequest request) {
        LegalTermResponse response = legalTermService.createTerm(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LegalTermResponse> updateTerm(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLegalTermRequest request) {
        LegalTermResponse response = legalTermService.updateTerm(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTerm(@PathVariable Long id) {
        legalTermService.deleteTerm(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Activate a specific term version
     * Deactivates all other terms of the same type
     */
    @PostMapping("/{id}/activate")
    public ResponseEntity<LegalTermResponse> activateTerm(@PathVariable Long id) {
        LegalTermResponse response = legalTermService.activateTerm(id);
        return ResponseEntity.ok(response);
    }
}

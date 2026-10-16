package com.bang9634.yasongmuseum.exhibition.controller;

import com.bang9634.yasongmuseum.exhibition.dto.CreateExhibitionRequest;
import com.bang9634.yasongmuseum.exhibition.dto.ExhibitionResponse;
import com.bang9634.yasongmuseum.exhibition.dto.UpdateExhibitionRequest;
import com.bang9634.yasongmuseum.exhibition.service.ExhibitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/management/exhibitions")
@RequiredArgsConstructor
public class ExhibitionManagementController {

    private final ExhibitionService exhibitionService;

    /**
     * Create new exhibition (Admin/Manager only)
     * Multipart form data with JSON and image file
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ExhibitionResponse> createExhibition(
            @RequestPart("data") @Valid CreateExhibitionRequest request,
            @RequestPart("image") MultipartFile imageFile) {
        ExhibitionResponse response = exhibitionService.createExhibition(request, imageFile);
        return ResponseEntity.ok(response);
    }

    /**
     * Update exhibition (Admin/Manager only)
     * Image file is optional - if not provided, keeps existing image
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ExhibitionResponse> updateExhibition(
            @PathVariable Long id,
            @RequestPart("data") @Valid UpdateExhibitionRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        ExhibitionResponse response = exhibitionService.updateExhibition(id, request, imageFile);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete exhibition (Admin/Manager only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, String>> deleteExhibition(@PathVariable Long id) {
        exhibitionService.deleteExhibition(id);
        return ResponseEntity.ok(Map.of("message", "전시가 성공적으로 삭제되었습니다."));
    }
}

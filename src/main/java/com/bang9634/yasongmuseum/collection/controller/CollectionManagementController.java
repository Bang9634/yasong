package com.bang9634.yasongmuseum.collection.controller;

import com.bang9634.yasongmuseum.collection.dto.CollectionResponse;
import com.bang9634.yasongmuseum.collection.dto.CreateCollectionRequest;
import com.bang9634.yasongmuseum.collection.dto.UpdateCollectionRequest;
import com.bang9634.yasongmuseum.collection.service.CollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/management/collections")
@RequiredArgsConstructor
public class CollectionManagementController {

    private final CollectionService collectionService;

    /**
     * Create new collection (Admin/Manager only)
     * Multipart form data with JSON and image file
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CollectionResponse> createCollection(
            @RequestPart("data") @Valid CreateCollectionRequest request,
            @RequestPart("image") MultipartFile imageFile) {
        CollectionResponse response = collectionService.createCollection(request, imageFile);
        return ResponseEntity.ok(response);
    }

    /**
     * Update collection (Admin/Manager only)
     * Image file is optional - if not provided, keeps existing image
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<CollectionResponse> updateCollection(
            @PathVariable Long id,
            @RequestPart("data") @Valid UpdateCollectionRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        CollectionResponse response = collectionService.updateCollection(id, request, imageFile);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete collection (Admin/Manager only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, String>> deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.ok(Map.of("message", "컬렉션이 성공적으로 삭제되었습니다."));
    }
}

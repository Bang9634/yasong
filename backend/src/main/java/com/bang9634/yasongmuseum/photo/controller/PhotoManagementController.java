package com.bang9634.yasongmuseum.photo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.photo.dto.PhotoRequest;
import com.bang9634.yasongmuseum.photo.dto.PhotoResponse;
import com.bang9634.yasongmuseum.photo.service.PhotoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Photo Management Controller
 * Admin endpoints for managing photos.
 */
@RestController
@RequestMapping("/api/management/photos")
@RequiredArgsConstructor
public class PhotoManagementController {

    private final PhotoService photoService;

    /**
     * Get single photo
     * 
     * @param id Photo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PhotoResponse> getPhoto(@PathVariable Long id) {
        PhotoResponse photo = photoService.getPhotoById(id);
        return ResponseEntity.ok(photo);
    }

    /**
     * Create new photo
     * Multipart form data with JSON and image file
     * 
     * @param request Photo creation request
     * @param imageFile Photo image file
     */
    @PostMapping
    public ResponseEntity<PhotoResponse> createPhoto(
            @RequestPart("data") @Valid PhotoRequest request,
            @RequestPart("image") MultipartFile imageFile) {
        PhotoResponse photo = photoService.createPhoto(request, imageFile);
        return ResponseEntity.ok(photo);
    }

    /**
     * Update existing photo
     * Image file is optional - if not provided, keeps existing image
     * 
     * @param id Photo ID
     * @param request Photo update request
     * @param imageFile Photo image file (optional)
     */
    @PutMapping("/{id}")
    public ResponseEntity<PhotoResponse> updatePhoto(
            @PathVariable Long id,
            @RequestPart("data") @Valid PhotoRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        PhotoResponse photo = photoService.updatePhoto(id, request, imageFile);
        return ResponseEntity.ok(photo);
    }

    /**
     * Delete photo
     * 
     * @param id Photo ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }
}

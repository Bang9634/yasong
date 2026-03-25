package com.bang9634.yasongmuseum.photo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.photo.dto.PhotoResponse;
import com.bang9634.yasongmuseum.photo.dto.PhotoSummaryResponse;
import com.bang9634.yasongmuseum.photo.service.PhotoService;

import lombok.RequiredArgsConstructor;

/**
 * Photo Controller
 * Public endpoints for viewing photos.
 */
@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    /**
     * Get photos with pagination and search
     * Returns list without description for better performance
     * 
     * @param page Page number (1-based)
     * @param limit Items per page
     * @param search Search keyword (title, description)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<PhotoSummaryResponse>> getPhotos(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String search
    ) {
        PagedResponse<PhotoSummaryResponse> response = photoService.getPhotos(page, limit, search);
        return ResponseEntity.ok(response);
    }

    /**
     * Get single photo with full details
     * Includes description
     * 
     * @param id Photo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PhotoResponse> getPhoto(@PathVariable Long id) {
        PhotoResponse photo = photoService.getPhotoById(id);
        return ResponseEntity.ok(photo);
    }
}

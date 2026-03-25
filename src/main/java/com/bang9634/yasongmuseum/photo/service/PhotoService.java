package com.bang9634.yasongmuseum.photo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.photo.dto.PhotoRequest;
import com.bang9634.yasongmuseum.photo.dto.PhotoResponse;
import com.bang9634.yasongmuseum.photo.dto.PhotoSummaryResponse;
import com.bang9634.yasongmuseum.photo.entity.Photo;
import com.bang9634.yasongmuseum.photo.repository.PhotoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PhotoService {

    private static final String PHOTO_IMAGE_DIR = "photos";
    private static final String PHOTO_IMAGE_PREFIX = "photo-";

    private final PhotoRepository photoRepository;
    private final FileStorageService fileStorageService;

    /**
     * Get photos with pagination and filtering (summary view without description)
     * 
     * @param page Page number (1-based)
     * @param limit Items per page
     * @param search Search keyword (title, description)
     * @return Paged response of photo summaries
     */
    public PagedResponse<PhotoSummaryResponse> getPhotos(int page, int limit, String search) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Photo> result = photoRepository.findFiltered(search, pageable);
        
        Page<PhotoSummaryResponse> responsePage = result.map(PhotoSummaryResponse::from);
        return new PagedResponse<>(responsePage);
    }

    /**
     * Get photo by ID with full details (including description)
     */
    public PhotoResponse getPhotoById(Long id) {
        log.info("Fetching photo by ID: {}", id);
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사진 자료를 찾을 수 없습니다."));
        
        return PhotoResponse.from(photo);
    }

    /**
     * Create new photo with image file
     */
    @Transactional
    public PhotoResponse createPhoto(PhotoRequest request, MultipartFile imageFile) {
        log.info("Creating photo: {}", request.getTitle());
        
        // 1. Upload image
        String imageUrl = fileStorageService.saveFile(imageFile, PHOTO_IMAGE_DIR, PHOTO_IMAGE_PREFIX);
        
        // 2. Create photo entity
        Photo photo = Photo.builder()
                .title(request.getTitle())
                .imageUrl(imageUrl)
                .description(request.getDescription())
                .build();
        
        Photo savedPhoto = photoRepository.save(photo);
        log.info("Photo created: id={}, title={}", savedPhoto.getId(), savedPhoto.getTitle());
        return PhotoResponse.from(savedPhoto);
    }

    /**
     * Update existing photo (with optional image update)
     */
    @Transactional
    public PhotoResponse updatePhoto(Long id, PhotoRequest request, MultipartFile imageFile) {
        log.info("Updating photo ID: {}", id);
        
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사진 자료를 찾을 수 없습니다."));
        
        // Update image if new file provided
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image
            fileStorageService.deleteFile(photo.getImageUrl());
            
            // Upload new image
            String newImageUrl = fileStorageService.saveFile(imageFile, PHOTO_IMAGE_DIR, PHOTO_IMAGE_PREFIX);
            photo.setImageUrl(newImageUrl);
        }
        
        // Update other fields
        photo.setTitle(request.getTitle());
        photo.setDescription(request.getDescription());
        
        Photo updatedPhoto = photoRepository.save(photo);
        log.info("Photo updated: id={}", updatedPhoto.getId());
        return PhotoResponse.from(updatedPhoto);
    }

    /**
     * Delete photo and its image file
     */
    @Transactional
    public void deletePhoto(Long id) {
        log.info("Deleting photo ID: {}", id);
        
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("사진 자료를 찾을 수 없습니다."));
        
        // Delete image file
        fileStorageService.deleteFile(photo.getImageUrl());
        
        // Delete photo entity
        photoRepository.deleteById(id);
        log.info("Photo deleted: id={}", id);
    }
}

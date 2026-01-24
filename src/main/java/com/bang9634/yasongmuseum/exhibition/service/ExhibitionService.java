package com.bang9634.yasongmuseum.exhibition.service;

import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.exhibition.dto.CreateExhibitionRequest;
import com.bang9634.yasongmuseum.exhibition.dto.ExhibitionResponse;
import com.bang9634.yasongmuseum.exhibition.dto.UpdateExhibitionRequest;
import com.bang9634.yasongmuseum.exhibition.entity.Exhibition;
import com.bang9634.yasongmuseum.exhibition.exception.ExhibitionNotFoundException;
import com.bang9634.yasongmuseum.exhibition.repository.ExhibitionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ExhibitionService {

    private final ExhibitionRepository exhibitionRepository;
    private final FileStorageService fileStorageService;

    private static final String EXHIBITION_IMAGE_DIR = "exhibitions";
    private static final String EXHIBITION_IMAGE_PREFIX = "exhibition-";

    /**
     * Get all exhibitions ordered by start date descending
     */
    public List<ExhibitionResponse> getAllExhibitions() {
        return exhibitionRepository.findAllByOrderByStartDateDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get ongoing exhibitions
     */
    public List<ExhibitionResponse> getOngoingExhibitions() {
        LocalDateTime now = LocalDateTime.now();
        return exhibitionRepository.findByStartDateBeforeAndEndDateAfter(now, now)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming exhibitions
     */
    public List<ExhibitionResponse> getUpcomingExhibitions() {
        LocalDateTime now = LocalDateTime.now();
        return exhibitionRepository.findByStartDateAfterOrderByStartDateAsc(now)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get past exhibitions
     */
    public List<ExhibitionResponse> getPastExhibitions() {
        LocalDateTime now = LocalDateTime.now();
        return exhibitionRepository.findByEndDateBeforeOrderByEndDateDesc(now)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get exhibition by ID
     */
    public ExhibitionResponse getExhibitionById(Long id) {
        Exhibition exhibition = exhibitionRepository.findById(id)
                .orElseThrow(() -> new ExhibitionNotFoundException(id));
        return toResponse(exhibition);
    }

    /**
     * Create new exhibition with image
     */
    @Transactional
    public ExhibitionResponse createExhibition(CreateExhibitionRequest request, MultipartFile imageFile) {
        // 1. Upload image
        String imageUrl = fileStorageService.saveFile(imageFile, EXHIBITION_IMAGE_DIR, EXHIBITION_IMAGE_PREFIX);

        // 2. Create exhibition entity
        Exhibition exhibition = Exhibition.builder()
                .title(request.getTitle())
                .artist(request.getArtist())
                .location(request.getLocation())
                .imageUrl(imageUrl)
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        Exhibition savedExhibition = exhibitionRepository.save(exhibition);
        log.info("Exhibition created: id={}, title={}", savedExhibition.getId(), savedExhibition.getTitle());

        return toResponse(savedExhibition);
    }

    /**
     * Update exhibition (with optional image update)
     */
    @Transactional
    public ExhibitionResponse updateExhibition(Long id, UpdateExhibitionRequest request, MultipartFile imageFile) {
        Exhibition exhibition = exhibitionRepository.findById(id)
                .orElseThrow(() -> new ExhibitionNotFoundException(id));

        // Update image if new file provided
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image
            fileStorageService.deleteFile(exhibition.getImageUrl());

            // Upload new image
            String newImageUrl = fileStorageService.saveFile(imageFile, EXHIBITION_IMAGE_DIR, EXHIBITION_IMAGE_PREFIX);
            exhibition.setImageUrl(newImageUrl);
        }

        // Update other fields
        exhibition.setTitle(request.getTitle());
        exhibition.setArtist(request.getArtist());
        exhibition.setLocation(request.getLocation());
        exhibition.setDescription(request.getDescription());
        exhibition.setStartDate(request.getStartDate());
        exhibition.setEndDate(request.getEndDate());

        log.info("Exhibition updated: id={}, title={}", exhibition.getId(), exhibition.getTitle());

        return toResponse(exhibition);
    }

    /**
     * Delete exhibition
     */
    @Transactional
    public void deleteExhibition(Long id) {
        Exhibition exhibition = exhibitionRepository.findById(id)
                .orElseThrow(() -> new ExhibitionNotFoundException(id));

        // Delete image file
        fileStorageService.deleteFile(exhibition.getImageUrl());

        // Delete entity
        exhibitionRepository.delete(exhibition);

        log.info("Exhibition deleted: id={}, title={}", id, exhibition.getTitle());
    }

    /**
     * Convert entity to response DTO
     */
    private ExhibitionResponse toResponse(Exhibition exhibition) {
        return ExhibitionResponse.builder()
                .id(exhibition.getId())
                .title(exhibition.getTitle())
                .artist(exhibition.getArtist())
                .location(exhibition.getLocation())
                .imageUrl(exhibition.getImageUrl())
                .description(exhibition.getDescription())
                .startDate(exhibition.getStartDate())
                .endDate(exhibition.getEndDate())
                .status(exhibition.getStatus())  // Automatically calculated
                .createdAt(exhibition.getCreatedAt())
                .updatedAt(exhibition.getUpdatedAt())
                .build();
    }
}

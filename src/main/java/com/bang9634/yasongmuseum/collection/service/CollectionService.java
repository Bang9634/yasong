package com.bang9634.yasongmuseum.collection.service;

import com.bang9634.yasongmuseum.collection.dto.CollectionResponse;
import com.bang9634.yasongmuseum.collection.dto.CreateCollectionRequest;
import com.bang9634.yasongmuseum.collection.dto.UpdateCollectionRequest;
import com.bang9634.yasongmuseum.collection.entity.ArtCollection;
import com.bang9634.yasongmuseum.collection.exception.CollectionNotFoundException;
import com.bang9634.yasongmuseum.collection.repository.CollectionRepository;
import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.common.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final FileStorageService fileStorageService;

    private static final String COLLECTION_IMAGE_DIR = "collections";
    private static final String COLLECTION_IMAGE_PREFIX = "collection-";

    /**
     * Get collections with pagination and filtering
     */
    public PagedResponse<CollectionResponse> getCollections(int page, int limit, String search, String yearFrom, String yearTo) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<ArtCollection> result = collectionRepository.findFiltered(search, yearFrom, yearTo, pageable);
        
        Page<CollectionResponse> responsePage = result.map(this::toResponse);
        return new PagedResponse<>(responsePage);
    }

    /**
     * Get random collections for recommendations
     * 
     * @param count Number of collections to retrieve
     * @param excludeId Optional ID of collection to exclude (e.g., currently viewing)
     * @return List of random collections
     */
    public List<CollectionResponse> getRandomCollections(int count, Long excludeId) {
        return collectionRepository.findRandomCollections(count, excludeId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get collection by ID
     */
    public CollectionResponse getCollectionById(Long id) {
        ArtCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new CollectionNotFoundException(id));
        return toResponse(collection);
    }

    /**
     * Create new collection with image
     */
    @Transactional
    public CollectionResponse createCollection(CreateCollectionRequest request, MultipartFile imageFile) {
        // 1. Upload image
        String imageUrl = fileStorageService.saveFile(imageFile, COLLECTION_IMAGE_DIR, COLLECTION_IMAGE_PREFIX);

        // 2. Create collection entity
        ArtCollection collection = ArtCollection.builder()
                .title(request.getTitle())
                .year(request.getYear())
                .size(request.getSize())
                .imageUrl(imageUrl)
                .description(request.getDescription())
                .artist(request.getArtist())
                .isPinned(request.getIsPinned() != null ? request.getIsPinned() : false)
                .build();

        ArtCollection savedCollection = collectionRepository.save(collection);
        log.info("Collection created: id={}, title={}", savedCollection.getId(), savedCollection.getTitle());

        return toResponse(savedCollection);
    }

    /**
     * Update collection (with optional image update)
     */
    @Transactional
    public CollectionResponse updateCollection(Long id, UpdateCollectionRequest request, MultipartFile imageFile) {
        ArtCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new CollectionNotFoundException(id));

        // Update image if new file provided
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image
            fileStorageService.deleteFile(collection.getImageUrl());

            // Upload new image
            String newImageUrl = fileStorageService.saveFile(imageFile, COLLECTION_IMAGE_DIR, COLLECTION_IMAGE_PREFIX);
            collection.setImageUrl(newImageUrl);
        }

        // Update other fields
        collection.setTitle(request.getTitle());
        collection.setYear(request.getYear());
        collection.setSize(request.getSize());
        collection.setDescription(request.getDescription());
        collection.setArtist(request.getArtist());
        if (request.getIsPinned() != null) {
            collection.setIsPinned(request.getIsPinned());
        }

        log.info("Collection updated: id={}, title={}", collection.getId(), collection.getTitle());

        return toResponse(collection);
    }

    /**
     * Delete collection
     */
    @Transactional
    public void deleteCollection(Long id) {
        ArtCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new CollectionNotFoundException(id));

        // Delete image file
        fileStorageService.deleteFile(collection.getImageUrl());

        // Delete entity
        collectionRepository.delete(collection);

        log.info("Collection deleted: id={}, title={}", id, collection.getTitle());
    }

    /**
     * Convert entity to response DTO
     */
    private CollectionResponse toResponse(ArtCollection collection) {
        return CollectionResponse.builder()
                .id(collection.getId())
                .title(collection.getTitle())
                .year(collection.getYear())
                .size(collection.getSize())
                .imageUrl(collection.getImageUrl())
                .description(collection.getDescription())
                .artist(collection.getArtist())
                .isPinned(collection.getIsPinned())
                .createdAt(collection.getCreatedAt())
                .updatedAt(collection.getUpdatedAt())
                .build();
    }
}

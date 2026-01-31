package com.bang9634.yasongmuseum.collection.controller;

import com.bang9634.yasongmuseum.collection.dto.CollectionResponse;
import com.bang9634.yasongmuseum.collection.service.CollectionService;
import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    /**
     * Get collections with pagination (Public API)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<CollectionResponse>> getCollections(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String yearFrom,
            @RequestParam(required = false) String yearTo
    ) {
        PagedResponse<CollectionResponse> response = collectionService.getCollections(page, limit, search, yearFrom, yearTo);
        return ResponseEntity.ok(response);
    }

    /**
     * Get collection by ID (Public API)
     */
    @GetMapping("/{id}")
    public ResponseEntity<CollectionResponse> getCollectionById(@PathVariable Long id) {
        CollectionResponse collection = collectionService.getCollectionById(id);
        return ResponseEntity.ok(collection);
    }
}

package com.bang9634.yasongmuseum.collection.controller;

import com.bang9634.yasongmuseum.collection.dto.CollectionResponse;
import com.bang9634.yasongmuseum.collection.service.CollectionService;
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
     * Get all collections (Public API)
     */
    @GetMapping
    public ResponseEntity<List<CollectionResponse>> getAllCollections() {
        List<CollectionResponse> collections = collectionService.getAllCollections();
        return ResponseEntity.ok(collections);
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

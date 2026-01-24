package com.bang9634.yasongmuseum.souvenir.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.souvenir.dto.CreateSouvenirRequest;
import com.bang9634.yasongmuseum.souvenir.dto.SouvenirResponse;
import com.bang9634.yasongmuseum.souvenir.dto.UpdateSouvenirRequest;
import com.bang9634.yasongmuseum.souvenir.service.SouvenirService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/management/souvenirs")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class SouvenirManagementController {
    
    private final SouvenirService souvenirService;

    @PostMapping
    public ResponseEntity<SouvenirResponse> createSouvenir(
            @RequestPart("data") @Valid CreateSouvenirRequest request,
            @RequestPart("image") MultipartFile imageFile) {
        SouvenirResponse response = souvenirService.createSouvenir(request, imageFile);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SouvenirResponse> updateSouvenir(
            @PathVariable Long id,
            @RequestPart("data") @Valid UpdateSouvenirRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        SouvenirResponse response = souvenirService.updateSouvenir(id, request, imageFile);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSouvenir(@PathVariable Long id) {
        souvenirService.deleteSouvenir(id);
        return ResponseEntity.noContent().build();
    }
}

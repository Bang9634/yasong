package com.bang9634.yasongmuseum.souvenir.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.souvenir.dto.SouvenirResponse;
import com.bang9634.yasongmuseum.souvenir.service.SouvenirService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/souvenirs")
@RequiredArgsConstructor
public class SouvenirController {
    
    private final SouvenirService souvenirService;

    @GetMapping
    public ResponseEntity<List<SouvenirResponse>> getAllSouvenirs() {
        List<SouvenirResponse> souvenirs = souvenirService.getAllSouvenirs();
        return ResponseEntity.ok(souvenirs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SouvenirResponse> getSouvenirById(@PathVariable Long id) {
        SouvenirResponse souvenir = souvenirService.getSouvenirById(id);
        return ResponseEntity.ok(souvenir);
    }
}

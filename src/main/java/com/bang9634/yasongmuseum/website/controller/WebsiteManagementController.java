package com.bang9634.yasongmuseum.website.controller;

import com.bang9634.yasongmuseum.website.dto.UpdateTextSettingRequest;
import com.bang9634.yasongmuseum.website.dto.UploadImageResponse;
import com.bang9634.yasongmuseum.website.service.WebsiteSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/management/website")
@RequiredArgsConstructor
public class WebsiteManagementController {

    private final WebsiteSettingsService websiteSettingsService;

    @PostMapping("/hero-image")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UploadImageResponse> uploadHeroImage(
            @RequestParam("image") MultipartFile file) {
        UploadImageResponse response = websiteSettingsService.uploadHeroImage(file);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, String>> updateTextSetting(
            @PathVariable String key,
            @Valid @RequestBody UpdateTextSettingRequest request) {
        websiteSettingsService.updateTextSetting(key, request.getValue());
        return ResponseEntity.ok(Map.of("message", "설정이 성공적으로 업데이트되었습니다."));
    }
}

package com.bang9634.yasongmuseum.website.controller;

import com.bang9634.yasongmuseum.website.dto.UpdateTextSettingRequest;
import com.bang9634.yasongmuseum.website.dto.UploadImageResponse;
import com.bang9634.yasongmuseum.website.entity.ImageType;
import com.bang9634.yasongmuseum.website.service.WebsiteSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/management/website")
@RequiredArgsConstructor
public class WebsiteManagementController {

    private final WebsiteSettingsService websiteSettingsService;

    /**
     * Generic image upload endpoint
     * Supports: hero, about, contact, gallery
     * 
     * Example: POST /api/management/website/images/hero
     *          POST /api/management/website/images/about
     */
    @PostMapping("/images/{imageType}")
    public ResponseEntity<UploadImageResponse> uploadImage(
            @PathVariable String imageType,
            @RequestParam("image") MultipartFile file) {
        ImageType type = ImageType.fromString(imageType);
        UploadImageResponse response = websiteSettingsService.uploadImage(file, type);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{key}")
    public ResponseEntity<Map<String, String>> updateTextSetting(
            @PathVariable String key,
            @Valid @RequestBody UpdateTextSettingRequest request) {
        websiteSettingsService.updateTextSetting(key, request.getValue());
        return ResponseEntity.ok(Map.of("message", "설정이 성공적으로 업데이트되었습니다."));
    }
}

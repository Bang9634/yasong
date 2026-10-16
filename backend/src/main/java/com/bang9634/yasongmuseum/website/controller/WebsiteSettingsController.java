package com.bang9634.yasongmuseum.website.controller;

import com.bang9634.yasongmuseum.website.dto.ImageResponse;
import com.bang9634.yasongmuseum.website.dto.TextSettingResponse;
import com.bang9634.yasongmuseum.website.entity.ImageType;
import com.bang9634.yasongmuseum.website.service.WebsiteSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/website/settings")
@RequiredArgsConstructor
public class WebsiteSettingsController {

    private final WebsiteSettingsService websiteSettingsService;

    /**
     * Generic image get endpoint
     * Supports: hero, about, contact, gallery
     * 
     * Example: GET /api/website/settings/images/hero
     *          GET /api/website/settings/images/about
     */
    @GetMapping("/images/{imageType}")
    public ResponseEntity<ImageResponse> getImage(@PathVariable String imageType) {
        ImageType type = ImageType.fromString(imageType);
        ImageResponse response = websiteSettingsService.getImage(type);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{key}")
    public ResponseEntity<TextSettingResponse> getTextSetting(@PathVariable String key) {
        TextSettingResponse response = websiteSettingsService.getTextSettingWithDetails(key);
        return ResponseEntity.ok(response);
    }
}

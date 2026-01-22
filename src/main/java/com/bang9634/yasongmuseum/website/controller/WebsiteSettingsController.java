package com.bang9634.yasongmuseum.website.controller;

import com.bang9634.yasongmuseum.website.dto.HeroImageResponse;
import com.bang9634.yasongmuseum.website.dto.TextSettingResponse;
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

    @GetMapping("/hero-image")
    public ResponseEntity<HeroImageResponse> getHeroImage() {
        HeroImageResponse response = websiteSettingsService.getHeroImage();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{key}")
    public ResponseEntity<TextSettingResponse> getTextSetting(@PathVariable String key) {
        TextSettingResponse response = websiteSettingsService.getTextSettingWithDetails(key);
        return ResponseEntity.ok(response);
    }
}

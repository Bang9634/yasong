package com.bang9634.yasongmuseum.website.service;

import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.website.dto.HeroImageResponse;
import com.bang9634.yasongmuseum.website.dto.TextSettingResponse;
import com.bang9634.yasongmuseum.website.dto.UploadImageResponse;
import com.bang9634.yasongmuseum.website.entity.WebsiteSettings;
import com.bang9634.yasongmuseum.website.exception.SettingNotFoundException;
import com.bang9634.yasongmuseum.website.repository.WebsiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class WebsiteSettingsService {

    private final WebsiteSettingsRepository websiteSettingsRepository;
    private final FileStorageService fileStorageService;

    @Value("${file.upload.hero.dir:hero}")
    private String heroDir;

    private static final String HERO_IMAGE_KEY = "hero_image_url";

    public HeroImageResponse getHeroImage() {
        WebsiteSettings setting = websiteSettingsRepository.findBySettingKey(HERO_IMAGE_KEY)
                .orElse(WebsiteSettings.builder()
                        .settingKey(HERO_IMAGE_KEY)
                        .settingValue("")
                        .build());

        return HeroImageResponse.builder()
                .imageUrl(setting.getSettingValue())
                .updatedAt(setting.getUpdatedAt())
                .build();
    }

    @Transactional
    public UploadImageResponse uploadHeroImage(MultipartFile file) {
        // 1. 파일 저장 (FileStorageService에 위임)
        String imageUrl = fileStorageService.saveFile(file, heroDir, "hero-");

        // 2. DB에 URL 저장 (기존 설정 업데이트 또는 새로 생성)
        WebsiteSettings setting = websiteSettingsRepository.findBySettingKey(HERO_IMAGE_KEY)
                .orElse(WebsiteSettings.builder()
                        .settingKey(HERO_IMAGE_KEY)
                        .description("Hero section background image URL")
                        .build());

        // 3. 기존 파일 삭제 (있다면)
        if (setting.getSettingValue() != null && !setting.getSettingValue().isEmpty()) {
            fileStorageService.deleteFile(setting.getSettingValue());
        }

        setting.updateValue(imageUrl);
        websiteSettingsRepository.save(setting);

        log.info("Hero image uploaded successfully: {}", imageUrl);

        return UploadImageResponse.builder()
                .imageUrl(imageUrl)
                .message("히어로 이미지가 성공적으로 업로드되었습니다.")
                .build();
    }

    /**
     * Get text setting by key with full response
     * 
     * @param key Setting key (e.g., "museum_about", "artist_bio")
     * @return TextSettingResponse with key, value, and updatedAt
     */
    public TextSettingResponse getTextSettingWithDetails(String key) {
        WebsiteSettings setting = websiteSettingsRepository.findBySettingKey(key)
                .orElse(WebsiteSettings.builder()
                        .settingKey(key)
                        .settingValue("")
                        .build());

        return TextSettingResponse.builder()
                .key(setting.getSettingKey())
                .value(setting.getSettingValue())
                .updatedAt(setting.getUpdatedAt())
                .build();
    }

    /**
     * Get text setting by key
     * 
     * @param key Setting key (e.g., "museum_about", "artist_bio")
     * @return Setting value
     */
    public String getTextSetting(String key) {
        return websiteSettingsRepository.findBySettingKey(key)
                .map(WebsiteSettings::getSettingValue)
                .orElse("");
    }

    /**
     * Update text setting
     * 
     * @param key Setting key
     * @param value Setting value
     */
    @Transactional
    public void updateTextSetting(String key, String value) {
        WebsiteSettings setting = websiteSettingsRepository.findBySettingKey(key)
                .orElse(WebsiteSettings.builder()
                        .settingKey(key)
                        .build());

        setting.updateValue(value);
        websiteSettingsRepository.save(setting);

        log.info("Text setting updated: {} = {}", key, value);
    }
}

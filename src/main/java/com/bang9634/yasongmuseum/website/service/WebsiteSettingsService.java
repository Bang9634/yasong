package com.bang9634.yasongmuseum.website.service;

import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.website.dto.ImageResponse;
import com.bang9634.yasongmuseum.website.dto.TextSettingResponse;
import com.bang9634.yasongmuseum.website.dto.UploadImageResponse;
import com.bang9634.yasongmuseum.website.entity.ImageType;
import com.bang9634.yasongmuseum.website.entity.WebsiteSettings;
import com.bang9634.yasongmuseum.website.repository.WebsiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    /**
     * Get image URL by image type
     * 
     * @param imageType Image type enum
     * @return Image response with URL and updatedAt
     */
    public ImageResponse getImage(ImageType imageType) {
        WebsiteSettings setting = websiteSettingsRepository.findBySettingKey(imageType.getSettingKey())
                .orElse(WebsiteSettings.builder()
                        .settingKey(imageType.getSettingKey())
                        .settingValue("")
                        .build());

        return ImageResponse.builder()
                .imageUrl(setting.getSettingValue())
                .updatedAt(setting.getUpdatedAt())
                .build();
    }

    /**
     * Upload image for specified type (Generic method)
     * 
     * @param file Multipart file to upload
     * @param imageType Image type enum
     * @return Upload response with URL and message
     */
    @Transactional
    public UploadImageResponse uploadImage(MultipartFile file, ImageType imageType) {
        // 1. Save file using FileStorageService
        String imageUrl = fileStorageService.saveFile(
                file, 
                imageType.getSubDirectory(), 
                imageType.getFilePrefix()
        );

        // 2. Save or update URL in DB
        WebsiteSettings setting = websiteSettingsRepository.findBySettingKey(imageType.getSettingKey())
                .orElse(WebsiteSettings.builder()
                        .settingKey(imageType.getSettingKey())
                        .description(imageType.getDescription())
                        .build());

        // 3. Delete old file if exists
        if (setting.getSettingValue() != null && !setting.getSettingValue().isEmpty()) {
            fileStorageService.deleteFile(setting.getSettingValue());
        }

        setting.updateValue(imageUrl);
        websiteSettingsRepository.save(setting);

        log.info("{} image uploaded successfully: {}", imageType.name(), imageUrl);

        return UploadImageResponse.builder()
                .imageUrl(imageUrl)
                .message(imageType.name() + " 이미지가 성공적으로 업로드되었습니다.")
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

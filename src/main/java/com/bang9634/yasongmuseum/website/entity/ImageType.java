package com.bang9634.yasongmuseum.website.entity;

import lombok.Getter;

/**
 * Image Type Enum
 * Defines supported image types for website settings.
 * Each type has a setting key and subdirectory for file storage.
 */
@Getter
public enum ImageType {
    HERO("hero_image_url", "hero", "hero-", "Hero section background image"),
    DIRECTOR("director_image_url", "director", "director-", "Director's profile image");
    
    private final String settingKey;
    private final String subDirectory;
    private final String filePrefix;
    private final String description;

    ImageType(String settingKey, String subDirectory, String filePrefix, String description) {
        this.settingKey = settingKey;
        this.subDirectory = subDirectory;
        this.filePrefix = filePrefix;
        this.description = description;
    }

    /**
     * Get ImageType from string value (case-insensitive)
     * 
     * @param type String representation of image type
     * @return ImageType enum
     * @throws IllegalArgumentException if type is not found
     */
    public static ImageType fromString(String type) {
        try {
            return ImageType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("지원하지 않는 이미지 타입입니다: " + type);
        }
    }
}

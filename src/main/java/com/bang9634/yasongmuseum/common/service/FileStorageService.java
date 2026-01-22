package com.bang9634.yasongmuseum.common.service;

import com.bang9634.yasongmuseum.website.exception.FileUploadException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * File Storage Service
 * Handles file upload, deletion, and validation.
 * Provides reusable file storage functionality for the entire application.
 */
@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    @Value("${file.upload.max-size:10485760}") // 10MB default
    private long maxFileSize;

    private static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");

    /**
     * Save uploaded file to the specified subdirectory
     * 
     * @param file MultipartFile to save
     * @param subDir Subdirectory (e.g., "hero", "artworks", "exhibitions")
     * @param prefix Filename prefix (e.g., "hero-", "artwork-")
     * @return Saved file's relative URL path (e.g., "/uploads/hero/hero-uuid.jpg")
     */
    public String saveFile(MultipartFile file, String subDir, String prefix) {
        validateFile(file);

        try {
            String savedFileName = generateFileName(file.getOriginalFilename(), prefix);
            Path uploadPath = Paths.get(uploadDir, subDir);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(savedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/" + uploadDir + "/" + subDir + "/" + savedFileName;
            log.info("File saved successfully: {}", fileUrl);
            
            return fileUrl;

        } catch (IOException e) {
            log.error("Failed to save file", e);
            throw new FileUploadException("파일 저장 중 오류가 발생했습니다.", e);
        }
    }

    /**
     * Delete file by URL path
     * 
     * @param fileUrl File URL (e.g., "/uploads/hero/hero-uuid.jpg")
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            // Extract filename from URL: /uploads/hero/hero-uuid.jpg -> uploads/hero/hero-uuid.jpg
            String relativePath = fileUrl.startsWith("/") ? fileUrl.substring(1) : fileUrl;
            Path filePath = Paths.get(relativePath);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted successfully: {}", fileUrl);
            }
        } catch (IOException e) {
            log.warn("Failed to delete file: {}", fileUrl, e);
            // Don't throw exception - deletion failure shouldn't block the main operation
        }
    }

    /**
     * Validate uploaded file
     * 
     * @param file MultipartFile to validate
     * @throws FileUploadException if validation fails
     */
    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("파일이 비어있습니다.");
        }

        if (file.getSize() > maxFileSize) {
            throw new FileUploadException("파일 크기는 " + (maxFileSize / 1024 / 1024) + "MB를 초과할 수 없습니다.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !hasAllowedExtension(originalFilename)) {
            throw new FileUploadException("허용되지 않는 파일 형식입니다. (jpg, jpeg, png, gif, webp만 가능)");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new FileUploadException("이미지 파일만 업로드 가능합니다.");
        }
    }

    private boolean hasAllowedExtension(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        return ALLOWED_IMAGE_EXTENSIONS.contains(extension);
    }

    private String generateFileName(String originalFilename, String prefix) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return prefix + UUID.randomUUID() + extension;
    }
}

package com.bang9634.yasongmuseum.common.controller;

import com.bang9634.yasongmuseum.notice.entity.NoticeAttachment;
import com.bang9634.yasongmuseum.notice.exception.NoticeNotFoundException;
import com.bang9634.yasongmuseum.notice.repository.NoticeAttachmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.net.URLEncoder;

/**
 * File Download Controller
 * Handles file downloads with proper Content-Disposition headers
 */
@Slf4j
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileDownloadController {

    private final NoticeAttachmentRepository noticeAttachmentRepository;

    /**
     * Download notice attachment with original filename
     * GET /api/files/attachments/{attachmentId}
     */
    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId) {
        log.info("Downloading attachment ID: {}", attachmentId);

        NoticeAttachment attachment = noticeAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new NoticeNotFoundException("첨부파일을 찾을 수 없습니다."));

        try {
            // Load file as Resource
            String relativePath = attachment.getFileUrl().startsWith("/") 
                ? attachment.getFileUrl().substring(1) 
                : attachment.getFileUrl();
            Path filePath = Paths.get(relativePath);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new NoticeNotFoundException("파일을 읽을 수 없습니다.");
            }

            // Encode filename for Content-Disposition (support Korean filenames)
            String encodedFilename = URLEncoder.encode(attachment.getFileName(), StandardCharsets.UTF_8)
                    .replaceAll("\\+", "%20");

            // Set Content-Disposition header with original filename
            String contentDisposition = String.format("attachment; filename=\"%s\"; filename*=UTF-8''%s",
                    encodedFilename, encodedFilename);

            log.info("File downloaded successfully: {} (original: {})", attachment.getFileUrl(), attachment.getFileName());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attachment.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(attachment.getFileSize()))
                    .body(resource);

        } catch (MalformedURLException e) {
            log.error("Invalid file path: {}", attachment.getFileUrl(), e);
            throw new NoticeNotFoundException("파일 경로가 올바르지 않습니다.");
        }
    }
}

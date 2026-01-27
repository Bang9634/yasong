package com.bang9634.yasongmuseum.notice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.notice.dto.CreateNoticeRequest;
import com.bang9634.yasongmuseum.notice.dto.NoticeAttachmentResponse;
import com.bang9634.yasongmuseum.notice.dto.NoticeResponse;
import com.bang9634.yasongmuseum.notice.dto.UpdateNoticeRequest;
import com.bang9634.yasongmuseum.notice.service.NoticeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/management/notices")
@RequiredArgsConstructor
public class NoticeManagementController {

    private final NoticeService noticeService;

    @GetMapping
    public ResponseEntity<List<NoticeResponse>> getAllNotices() {
        List<NoticeResponse> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponse> getNotice(@PathVariable Long id) {
        NoticeResponse notice = noticeService.getNoticeById(id);
        return ResponseEntity.ok(notice);
    }

    @PostMapping
    public ResponseEntity<NoticeResponse> createNotice(
        @Valid @RequestBody CreateNoticeRequest request,
        @AuthenticationPrincipal String username) {
        NoticeResponse notice = noticeService.createNotice(request, username);
        return ResponseEntity.ok(notice);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoticeResponse> updateNotice(
        @PathVariable Long id,
        @Valid @RequestBody UpdateNoticeRequest request) {
        NoticeResponse notice = noticeService.updateNotice(id, request);
        return ResponseEntity.ok(notice);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== Attachment Endpoints ====================

    /**
     * Upload attachment to a notice
     * POST /api/management/notices/{noticeId}/attachments
     */
    @PostMapping("/{noticeId}/attachments")
    public ResponseEntity<NoticeAttachmentResponse> uploadAttachment(
            @PathVariable Long noticeId,
            @RequestParam("file") MultipartFile file) {
        NoticeAttachmentResponse attachment = noticeService.uploadAttachment(noticeId, file);
        return ResponseEntity.ok(attachment);
    }

    /**
     * Get all attachments of a notice
     * GET /api/management/notices/{noticeId}/attachments
     */
    @GetMapping("/{noticeId}/attachments")
    public ResponseEntity<List<NoticeAttachmentResponse>> getAttachments(@PathVariable Long noticeId) {
        List<NoticeAttachmentResponse> attachments = noticeService.getAttachments(noticeId);
        return ResponseEntity.ok(attachments);
    }

    /**
     * Delete a specific attachment
     * DELETE /api/management/notices/{noticeId}/attachments/{attachmentId}
     */
    @DeleteMapping("/{noticeId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long noticeId,
            @PathVariable Long attachmentId) {
        noticeService.deleteAttachment(noticeId, attachmentId);
        return ResponseEntity.noContent().build();
    }
}

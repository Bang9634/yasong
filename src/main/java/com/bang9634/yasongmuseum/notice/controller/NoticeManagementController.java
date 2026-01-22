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
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.notice.dto.CreateNoticeRequest;
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

    @GetMapping("/management")
    public ResponseEntity<List<NoticeResponse>> getAllNotices() {
        List<NoticeResponse> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(notices);
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
}

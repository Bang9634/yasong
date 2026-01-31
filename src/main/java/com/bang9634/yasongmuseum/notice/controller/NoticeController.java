package com.bang9634.yasongmuseum.notice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.notice.dto.NoticeResponse;
import com.bang9634.yasongmuseum.notice.service.NoticeService;

import lombok.RequiredArgsConstructor;

/**
 * Notice Controller
 * Public endpoints for fetching notices.
 */
@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;
    
    /**
     * Get notices with pagination (Public API)
     */
    @GetMapping
    public ResponseEntity<PagedResponse<NoticeResponse>> getNotices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category
    ) {
        PagedResponse<NoticeResponse> response = noticeService.getNotices(page, limit, search, category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoticeResponse> getVisibleNotice(@PathVariable Long id) {
        NoticeResponse notice = noticeService.getVisibleNoticeById(id);
        return ResponseEntity.ok(notice);
    }
}

package com.bang9634.yasongmuseum.notice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.notice.dto.CreateNoticeRequest;
import com.bang9634.yasongmuseum.notice.dto.NoticeResponse;
import com.bang9634.yasongmuseum.notice.dto.UpdateNoticeRequest;
import com.bang9634.yasongmuseum.notice.entity.Notice;
import com.bang9634.yasongmuseum.notice.exception.NoticeAlreadyDeletedException;
import com.bang9634.yasongmuseum.notice.exception.NoticeNotFoundException;
import com.bang9634.yasongmuseum.notice.repository.NoticeRepository;
import com.bang9634.yasongmuseum.user.entity.User;
import com.bang9634.yasongmuseum.user.exception.UserNotFoundException;
import com.bang9634.yasongmuseum.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    public List<NoticeResponse> getVisibleNotices() {
        log.info("Fetching all visible notices");
        return noticeRepository.findVisibleNotices().stream()
                .map(NoticeResponse::from)
                .toList();
    }

    @Transactional
    public NoticeResponse getNoticeById(Long id) {
        log.info("Fetching notice by ID: {}", id);
        Notice notice = noticeRepository.findVisibleNoticeById(id)
                .orElseThrow(() -> new NoticeNotFoundException("게시글을 찾을 수 없습니다.") );

        notice.increaseViewCount();
        noticeRepository.save(notice);

        return NoticeResponse.from(notice);
    }

    public List<NoticeResponse> getAllNotices() {
        log.info("Fetching all notices (admin)");
        return noticeRepository.findAllNotDeleted().stream()
                .map(NoticeResponse::from)
                .toList();
    }

    @Transactional
    public NoticeResponse createNotice(CreateNoticeRequest request, String username) {
        log.info("Creating notice {} by user: {}", request.getTitle(), username);

        User author = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .isPinned(request.getIsPinned())
                .status(request.getStatus())
                .author(author)
                .viewCount(0)
                .build();

        Notice savedNotice = noticeRepository.save(notice);
        log.info("Notice created successfully: {}", savedNotice.getId());
        return NoticeResponse.from(savedNotice);
    }

    @Transactional
    public NoticeResponse updateNotice(Long id, UpdateNoticeRequest request) {
        log.info("Updating notice ID: {}", id);
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoticeNotFoundException("게시글을 찾을 수 없습니다.") );

        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setCategory(request.getCategory());
        notice.setIsPinned(request.getIsPinned());
        notice.setStatus(request.getStatus());

        Notice updatedNotice = noticeRepository.save(notice);
        log.info("Notice updated successfully: {}", updatedNotice.getId());
        return NoticeResponse.from(updatedNotice);
    }

    @Transactional
    public void deleteNotice(Long id) {
        log.info("Deleting notice ID: {}", id);

        Notice notice = noticeRepository.findById(id)
            .orElseThrow(() -> new NoticeNotFoundException("게시글을 찾을 수 없습니다."));

        if (notice.isDeleted()) {
            throw new NoticeAlreadyDeletedException("이미 삭제된 게시글입니다.");
        }

        notice.setDeletedAt(LocalDateTime.now());
        noticeRepository.save(notice);

        log.info("Notice deleted successfully: {}", id);
    }
}

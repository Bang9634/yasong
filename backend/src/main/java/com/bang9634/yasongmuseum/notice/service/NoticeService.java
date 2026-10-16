package com.bang9634.yasongmuseum.notice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.notice.dto.CreateNoticeRequest;
import com.bang9634.yasongmuseum.notice.dto.NoticeAttachmentResponse;
import com.bang9634.yasongmuseum.notice.dto.NoticeResponse;
import com.bang9634.yasongmuseum.notice.dto.UpdateNoticeRequest;
import com.bang9634.yasongmuseum.notice.entity.Notice;
import com.bang9634.yasongmuseum.notice.entity.NoticeAttachment;
import com.bang9634.yasongmuseum.notice.exception.NoticeAlreadyDeletedException;
import com.bang9634.yasongmuseum.notice.exception.NoticeNotFoundException;
import com.bang9634.yasongmuseum.notice.repository.NoticeAttachmentRepository;
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
    private final NoticeAttachmentRepository noticeAttachmentRepository;
    private final FileStorageService fileStorageService;

    /**
     * Get notices with pagination and filtering
     */
    public PagedResponse<NoticeResponse> getNotices(int page, int limit, String search, String category, String status) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Notice> result = noticeRepository.findFiltered(search, category, status, pageable);
        
        Page<NoticeResponse> responsePage = result.map(NoticeResponse::from);
        return new PagedResponse<>(responsePage);
    }

    @Transactional
    public NoticeResponse getVisibleNoticeById(Long id) {
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
    public NoticeResponse getNoticeById(Long id) {
        log.info("Fetching notice by ID: {}", id);
        Notice notice = noticeRepository.findNoticeById(id)
                .orElseThrow(() -> new NoticeNotFoundException("게시글을 찾을 수 없습니다.") );

        notice.increaseViewCount();
        noticeRepository.save(notice);

        return NoticeResponse.from(notice);
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

    // ==================== Attachment Methods ====================

    /**
     * Upload image for notice content (editor)
     * Returns image URL to be inserted in <img> tag
     */
    @Transactional
    public String uploadContentImage(MultipartFile file) {
        log.info("Uploading content image: {}", file.getOriginalFilename());
        
        // Use saveFile (image validation only)
        String imageUrl = fileStorageService.saveFile(file, "notice_content", "notice-content-");
        
        log.info("Content image uploaded successfully: {}", imageUrl);
        return imageUrl;
    }

    /**
     * Upload attachment to a notice
     */
    @Transactional
    public NoticeAttachmentResponse uploadAttachment(Long noticeId, MultipartFile file) {
        log.info("Uploading attachment to notice ID: {}", noticeId);
        
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("게시글을 찾을 수 없습니다."));

        // Save file with document validation
        String fileUrl = fileStorageService.saveDocumentFile(file, "notices", "notice-attachment-");

        // Create attachment entity
        NoticeAttachment attachment = NoticeAttachment.builder()
                .notice(notice)
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .build();

        NoticeAttachment savedAttachment = noticeAttachmentRepository.save(attachment);
        log.info("Attachment uploaded successfully: {}", savedAttachment.getId());

        return NoticeAttachmentResponse.from(savedAttachment);
    }

    /**
     * Get all attachments of a notice
     */
    public List<NoticeAttachmentResponse> getAttachments(Long noticeId) {
        log.info("Fetching attachments for notice ID: {}", noticeId);
        
        if (!noticeRepository.existsById(noticeId)) {
            throw new NoticeNotFoundException("게시글을 찾을 수 없습니다.");
        }

        return noticeAttachmentRepository.findByNoticeId(noticeId).stream()
                .map(NoticeAttachmentResponse::from)
                .toList();
    }

    /**
     * Delete a specific attachment
     */
    @Transactional
    public void deleteAttachment(Long noticeId, Long attachmentId) {
        log.info("Deleting attachment ID: {} from notice ID: {}", attachmentId, noticeId);
        
        NoticeAttachment attachment = noticeAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new NoticeNotFoundException("첨부파일을 찾을 수 없습니다."));

        if (!attachment.getNotice().getId().equals(noticeId)) {
            throw new NoticeNotFoundException("해당 게시글의 첨부파일이 아닙니다.");
        }

        // Delete physical file
        fileStorageService.deleteFile(attachment.getFileUrl());

        // Delete from database
        noticeAttachmentRepository.delete(attachment);
        log.info("Attachment deleted successfully: {}", attachmentId);
    }
}

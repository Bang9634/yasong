package com.bang9634.yasongmuseum.contest.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.common.exception.ResourceNotFoundException;
import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.contest.dto.ContestAttachmentResponse;
import com.bang9634.yasongmuseum.contest.dto.ContestResponse;
import com.bang9634.yasongmuseum.contest.dto.CreateContestRequest;
import com.bang9634.yasongmuseum.contest.dto.UpdateContestRequest;
import com.bang9634.yasongmuseum.contest.entity.Contest;
import com.bang9634.yasongmuseum.contest.entity.ContestAttachment;
import com.bang9634.yasongmuseum.contest.repository.ContestAttachmentRepository;
import com.bang9634.yasongmuseum.contest.repository.ContestRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContestService {

    private final ContestRepository contestRepository;
    private final ContestAttachmentRepository contestAttachmentRepository;
    private final FileStorageService fileStorageService;

    /**
     * Get contests with pagination and filters
     */
    public PagedResponse<ContestResponse> getContests(
            int page, 
            int limit, 
            String search, 
            String status) {
        
        Pageable pageable = PageRequest.of(page - 1, limit);
        LocalDateTime now = LocalDateTime.now();
        
        Page<Contest> contestPage = contestRepository.findFiltered(search, status, now, pageable);
        Page<ContestResponse> responsePage = contestPage.map(ContestResponse::from);
        
        return new PagedResponse<>(responsePage);
    }

    /**
     * Get contest by ID
     */
    public ContestResponse getContestById(Long id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공모전을 찾을 수 없습니다."));
        return ContestResponse.from(contest);
    }

    /**
     * Create new contest
     */
    @Transactional
    public ContestResponse createContest(CreateContestRequest request, MultipartFile imageFile) {
        String imageUrl = fileStorageService.saveFile(imageFile, "contests", "contest-");
        
        Contest contest = Contest.builder()
                .title(request.getTitle())
                .location(request.getLocation())
                .imageUrl(imageUrl)
                .host(request.getHost())
                .description(request.getDescription())
                .announcementUrl(request.getAnnouncementUrl())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        
        Contest saved = contestRepository.save(contest);
        return ContestResponse.from(saved);
    }

    /**
     * Update contest
     */
    @Transactional
    public ContestResponse updateContest(Long id, UpdateContestRequest request, MultipartFile imageFile) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공모전을 찾을 수 없습니다."));
        
        // Update image if new file is provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String newImageUrl = fileStorageService.saveFile(imageFile, "contests", "contest-");
            contest.setImageUrl(newImageUrl);
        }
        
        contest.setTitle(request.getTitle());
        contest.setLocation(request.getLocation());
        contest.setHost(request.getHost());
        contest.setDescription(request.getDescription());
        contest.setAnnouncementUrl(request.getAnnouncementUrl());
        contest.setStartDate(request.getStartDate());
        contest.setEndDate(request.getEndDate());
        
        Contest updated = contestRepository.save(contest);
        return ContestResponse.from(updated);
    }

    /**
     * Delete contest and its attachments
     * 
     * Note: Attachments are automatically deleted via CASCADE.ALL
     * File cleanup is handled by FileStorageService if needed
     */
    @Transactional
    public void deleteContest(Long id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공모전을 찾을 수 없습니다."));
        
        // Cleanup attachment files
        contest.getAttachments().forEach(attachment -> {
            try {
                fileStorageService.deleteFile(attachment.getFileUrl());
            } catch (Exception e) {
                log.warn("Failed to delete attachment file: {}", attachment.getFileUrl(), e);
            }
        });
        
        contestRepository.delete(contest);
        log.info("Contest deleted: id={}", id);
    }

    // ==================== Attachment Methods ====================

    /**
     * Upload attachment to a contest
     * 
     * Supports documents (PDF, DOC, HWP, etc.) for contest forms and announcements
     * Files are stored in /uploads/contests/ directory with unique names
     * 
     * @param contestId Contest ID to attach file to
     * @param file Multipart file to upload
     * @return ContestAttachmentResponse with file metadata
     * @throws ResourceNotFoundException if contest not found
     * @throws com.bang9634.yasongmuseum.website.exception.FileUploadException if file validation fails
     */
    @Transactional
    public ContestAttachmentResponse uploadAttachment(Long contestId, MultipartFile file) {
        log.info("Uploading attachment to contest ID: {}, filename: {}", contestId, file.getOriginalFilename());
        
        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() -> new ResourceNotFoundException("공모전을 찾을 수 없습니다."));

        // Save file with document validation (PDF, DOC, HWP, etc.)
        String fileUrl = fileStorageService.saveDocumentFile(file, "contests", "contest-attachment-");

        // Create attachment entity
        ContestAttachment attachment = ContestAttachment.builder()
                .contest(contest)
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .fileSize(file.getSize())
                .contentType(file.getContentType())
                .build();

        ContestAttachment savedAttachment = contestAttachmentRepository.save(attachment);
        log.info("Attachment uploaded successfully: id={}, filename={}", 
                 savedAttachment.getId(), savedAttachment.getFileName());

        return ContestAttachmentResponse.from(savedAttachment);
    }

    /**
     * Get all attachments of a contest
     * 
     * Returns empty list if no attachments found
     * Useful for displaying attachment list on contest detail page
     * 
     * @param contestId Contest ID
     * @return List of attachment responses
     * @throws ResourceNotFoundException if contest not found
     */
    public List<ContestAttachmentResponse> getAttachments(Long contestId) {
        log.debug("Fetching attachments for contest ID: {}", contestId);
        
        // Verify contest exists
        if (!contestRepository.existsById(contestId)) {
            throw new ResourceNotFoundException("공모전을 찾을 수 없습니다.");
        }

        return contestAttachmentRepository.findByContestId(contestId).stream()
                .map(ContestAttachmentResponse::from)
                .toList();
    }

    /**
     * Delete a specific attachment
     * 
     * Removes both database record and physical file
     * Accessible only to administrators via management API
     * 
     * @param contestId Contest ID (for verification)
     * @param attachmentId Attachment ID to delete
     * @throws ResourceNotFoundException if contest or attachment not found
     * @throws IllegalArgumentException if attachment doesn't belong to contest
     */
    @Transactional
    public void deleteAttachment(Long contestId, Long attachmentId) {
        log.info("Deleting attachment: contestId={}, attachmentId={}", contestId, attachmentId);
        
        // Verify contest exists
        if (!contestRepository.existsById(contestId)) {
            throw new ResourceNotFoundException("공모전을 찾을 수 없습니다.");
        }

        ContestAttachment attachment = contestAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("첨부파일을 찾을 수 없습니다."));

        // Verify attachment belongs to contest (security check)
        if (!attachment.getContest().getId().equals(contestId)) {
            throw new IllegalArgumentException("첨부파일이 해당 공모전에 속하지 않습니다.");
        }

        // Delete physical file
        try {
            fileStorageService.deleteFile(attachment.getFileUrl());
        } catch (Exception e) {
            log.warn("Failed to delete attachment file: {}", attachment.getFileUrl(), e);
            // Continue with DB deletion even if file deletion fails
        }

        // Delete database record
        contestAttachmentRepository.delete(attachment);
        log.info("Attachment deleted successfully: id={}", attachmentId);
    }
}

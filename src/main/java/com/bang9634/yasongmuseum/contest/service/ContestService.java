package com.bang9634.yasongmuseum.contest.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.common.exception.ResourceNotFoundException;
import com.bang9634.yasongmuseum.contest.dto.ContestResponse;
import com.bang9634.yasongmuseum.contest.dto.CreateContestRequest;
import com.bang9634.yasongmuseum.contest.dto.UpdateContestRequest;
import com.bang9634.yasongmuseum.contest.entity.Contest;
import com.bang9634.yasongmuseum.contest.repository.ContestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContestService {

    private final ContestRepository contestRepository;

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
    public ContestResponse createContest(CreateContestRequest request) {
        Contest contest = Contest.builder()
                .title(request.getTitle())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
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
    public ContestResponse updateContest(Long id, UpdateContestRequest request) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공모전을 찾을 수 없습니다."));
        
        contest.setTitle(request.getTitle());
        contest.setLocation(request.getLocation());
        contest.setImageUrl(request.getImageUrl());
        contest.setHost(request.getHost());
        contest.setDescription(request.getDescription());
        contest.setAnnouncementUrl(request.getAnnouncementUrl());
        contest.setStartDate(request.getStartDate());
        contest.setEndDate(request.getEndDate());
        
        Contest updated = contestRepository.save(contest);
        return ContestResponse.from(updated);
    }

    /**
     * Delete contest
     */
    @Transactional
    public void deleteContest(Long id) {
        Contest contest = contestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("공모전을 찾을 수 없습니다."));
        contestRepository.delete(contest);
    }
}

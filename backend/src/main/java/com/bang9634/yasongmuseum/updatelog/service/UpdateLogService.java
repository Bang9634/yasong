package com.bang9634.yasongmuseum.updatelog.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.common.dto.PagedResponse;
import com.bang9634.yasongmuseum.common.exception.ResourceNotFoundException;
import com.bang9634.yasongmuseum.updatelog.dto.CreateUpdateLogRequest;
import com.bang9634.yasongmuseum.updatelog.dto.UpdateLogResponse;
import com.bang9634.yasongmuseum.updatelog.dto.UpdateUpdateLogRequest;
import com.bang9634.yasongmuseum.updatelog.entity.UpdateLog;
import com.bang9634.yasongmuseum.updatelog.repository.UpdateLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UpdateLogService {

    private final UpdateLogRepository updateLogRepository;

    /**
     * Get update logs with pagination (Public)
     */
    public PagedResponse<UpdateLogResponse> getUpdateLogs(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<UpdateLog> logPage = updateLogRepository.findAllByOrderByUpdateDateDesc(pageable);
        Page<UpdateLogResponse> responsePage = logPage.map(UpdateLogResponse::from);
        
        return new PagedResponse<>(responsePage);
    }

    /**
     * Get update log by ID (Public)
     */
    public UpdateLogResponse getUpdateLogById(Long id) {
        UpdateLog log = updateLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("업데이트 내역을 찾을 수 없습니다."));
        return UpdateLogResponse.from(log);
    }

    /**
     * Create new update log (Admin)
     */
    @Transactional
    public UpdateLogResponse createUpdateLog(CreateUpdateLogRequest request) {
        UpdateLog log = UpdateLog.builder()
                .title(request.getTitle())
                .version(request.getVersion())
                .updateDate(request.getUpdateDate())
                .content(request.getContent())
                .build();
        
        UpdateLog saved = updateLogRepository.save(log);
        return UpdateLogResponse.from(saved);
    }

    /**
     * Update update log (Admin)
     */
    @Transactional
    public UpdateLogResponse updateUpdateLog(Long id, UpdateUpdateLogRequest request) {
        UpdateLog log = updateLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("업데이트 내역을 찾을 수 없습니다."));
        
        log.setTitle(request.getTitle());
        log.setVersion(request.getVersion());
        log.setUpdateDate(request.getUpdateDate());
        log.setContent(request.getContent());
        
        UpdateLog updated = updateLogRepository.save(log);
        return UpdateLogResponse.from(updated);
    }

    /**
     * Delete update log (Admin)
     */
    @Transactional
    public void deleteUpdateLog(Long id) {
        UpdateLog log = updateLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("업데이트 내역을 찾을 수 없습니다."));
        updateLogRepository.delete(log);
    }
}

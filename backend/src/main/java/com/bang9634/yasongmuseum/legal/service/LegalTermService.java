package com.bang9634.yasongmuseum.legal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bang9634.yasongmuseum.common.exception.ResourceNotFoundException;
import com.bang9634.yasongmuseum.legal.dto.CreateLegalTermRequest;
import com.bang9634.yasongmuseum.legal.dto.LegalTermResponse;
import com.bang9634.yasongmuseum.legal.dto.LegalTermSummaryResponse;
import com.bang9634.yasongmuseum.legal.dto.UpdateLegalTermRequest;
import com.bang9634.yasongmuseum.legal.entity.LegalTerm;
import com.bang9634.yasongmuseum.legal.entity.TermType;
import com.bang9634.yasongmuseum.legal.repository.LegalTermRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LegalTermService {

    private final LegalTermRepository legalTermRepository;

    /**
     * Get currently active term by type (Public)
     */
    public LegalTermResponse getCurrentTerm(TermType type) {
        LegalTerm term = legalTermRepository.findByTypeAndIsActiveTrue(type)
                .orElseThrow(() -> new ResourceNotFoundException("현재 적용중인 " + type.getDescription() + "을(를) 찾을 수 없습니다."));
        return LegalTermResponse.from(term);
    }

    /**
     * Get all historical versions by type (Public, without content)
     */
    public List<LegalTermSummaryResponse> getTermHistory(TermType type) {
        List<LegalTerm> terms = legalTermRepository.findByTypeOrderByStartDateDesc(type);
        return terms.stream()
                .map(LegalTermSummaryResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * Get term by ID (Admin)
     */
    public LegalTermResponse getTermById(Long id) {
        LegalTerm term = legalTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("약관을 찾을 수 없습니다."));
        return LegalTermResponse.from(term);
    }

    /**
     * Create new term (Admin)
     * Automatically deactivates previous active term of the same type
     */
    @Transactional
    public LegalTermResponse createTerm(CreateLegalTermRequest request) {
        // Deactivate all previous active terms of the same type
        legalTermRepository.deactivateAllByType(request.getType());
        
        LegalTerm term = LegalTerm.builder()
                .type(request.getType())
                .version(request.getVersion())
                .content(request.getContent())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isActive(true) // New term is active by default
                .build();
        
        LegalTerm saved = legalTermRepository.save(term);
        return LegalTermResponse.from(saved);
    }

    /**
     * Update term (Admin)
     */
    @Transactional
    public LegalTermResponse updateTerm(Long id, UpdateLegalTermRequest request) {
        LegalTerm term = legalTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("약관을 찾을 수 없습니다."));
        
        term.setVersion(request.getVersion());
        term.setContent(request.getContent());
        term.setStartDate(request.getStartDate());
        term.setEndDate(request.getEndDate());
        
        LegalTerm updated = legalTermRepository.save(term);
        return LegalTermResponse.from(updated);
    }

    /**
     * Delete term (Admin)
     */
    @Transactional
    public void deleteTerm(Long id) {
        LegalTerm term = legalTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("약관을 찾을 수 없습니다."));
        legalTermRepository.delete(term);
    }

    /**
     * Activate a specific term (Admin)
     * Deactivates all other terms of the same type
     */
    @Transactional
    public LegalTermResponse activateTerm(Long id) {
        LegalTerm term = legalTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("약관을 찾을 수 없습니다."));
        
        // Deactivate all active terms of the same type
        legalTermRepository.deactivateAllByType(term.getType());
        
        // Activate this term
        term.setIsActive(true);
        LegalTerm updated = legalTermRepository.save(term);
        
        return LegalTermResponse.from(updated);
    }
}

package com.bang9634.yasongmuseum.contest.repository;

import com.bang9634.yasongmuseum.contest.entity.ContestAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Contest Attachment Repository
 * Handles database operations for contest attachments
 * 
 * Design Notes:
 * - findByContestId: Retrieves all attachments for a contest (for display)
 * - deleteByContestId: Cleanup method used when contest is deleted
 *   (typically handled by CASCADE, but useful for manual cleanup)
 * 
 * @see ContestAttachment
 */
@Repository
public interface ContestAttachmentRepository extends JpaRepository<ContestAttachment, Long> {
    
    /**
     * Find all attachments for a specific contest
     * Ordered by upload date (newest first) by default
     * 
     * @param contestId Contest ID
     * @return List of attachments
     */
    List<ContestAttachment> findByContestId(Long contestId);
    
    /**
     * Delete all attachments for a specific contest
     * Note: Usually handled by CASCADE.ALL, but available for explicit cleanup
     * 
     * @param contestId Contest ID
     */
    void deleteByContestId(Long contestId);
}

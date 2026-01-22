package com.bang9634.yasongmuseum.notice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bang9634.yasongmuseum.notice.entity.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long>{
    
    /**
     * Fetch all visible notices that are not deleted and have status 'PUBLISHED',
     * ordered by pinned status and creation date.
     */
    @Query("""
        SELECT n FROM Notice n
        WHERE n.deletedAt IS NULL
        AND n.status = 'PUBLISHED'
        ORDER BY n.isPinned DESC, n.createdAt DESC
        """)
    List<Notice> findVisibleNotices();

    @Query("""
        SELECT n FROM Notice n
        WHERE n.id = :id
        AND n.deletedAt IS NULL
        AND n.status = 'PUBLISHED'
        """)
    Optional<Notice> findVisibleNoticeById(Long id);

    /**
     * Fetch all notices that are not deleted, regardless of their status.
     * @apiNote Used for admin purposes.
     */
    @Query("""
        SELECT n FROM Notice n
        WHERE n.deletedAt IS NULL
        ORDER BY n.isPinned DESC, n.createdAt DESC    
        """)
    List<Notice> findAllNotDeleted();
}

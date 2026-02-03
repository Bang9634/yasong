package com.bang9634.yasongmuseum.notice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bang9634.yasongmuseum.notice.entity.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long>{
    
    @Query("""
        SELECT n FROM Notice n
        WHERE n.id = :id
        AND n.deletedAt IS NULL
        AND n.status = 'PUBLISHED'
        """)
    Optional<Notice> findVisibleNoticeById(Long id);

        @Query("""
        SELECT n FROM Notice n
        WHERE n.id = :id
        AND n.deletedAt IS NULL
        """)
    Optional<Notice> findNoticeById(Long id);

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

    /**
     * Find visible notices with pagination and filtering
     */
    @Query("""
        SELECT n FROM Notice n
        WHERE n.deletedAt IS NULL
        AND (:status IS NULL OR CAST(n.status AS string) = :status)
        AND (:search IS NULL OR 
             LOWER(n.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(n.content) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:category IS NULL OR CAST(n.category AS string) = :category)
        ORDER BY n.isPinned DESC, n.createdAt DESC
        """)
    Page<Notice> findFiltered(
        @Param("search") String search,
        @Param("category") String category,
        @Param("status") String status,
        Pageable pageable
    );
}

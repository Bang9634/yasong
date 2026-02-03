package com.bang9634.yasongmuseum.contest.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bang9634.yasongmuseum.contest.entity.Contest;

public interface ContestRepository extends JpaRepository<Contest, Long> {
    
    /**
     * Find contests with filters and pagination
     * 
     * @param search Search keyword (title, description, host, location)
     * @param status Contest status filter (ongoing, upcoming, past)
     * @param now Current datetime for status calculation
     * @param pageable Pagination information
     * @return Page of contests
     */
    @Query("""
        SELECT c FROM Contest c
        WHERE (:search IS NULL OR 
               LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(c.host) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(c.location) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:status IS NULL OR
             CASE 
                 WHEN :status = 'ongoing' THEN (c.startDate <= :now AND c.endDate >= :now)
                 WHEN :status = 'upcoming' THEN (c.startDate > :now)
                 WHEN :status = 'past' THEN (c.endDate < :now)
                 ELSE TRUE
             END)
        ORDER BY c.startDate DESC
        """)
    Page<Contest> findFiltered(
        @Param("search") String search,
        @Param("status") String status,
        @Param("now") LocalDateTime now,
        Pageable pageable
    );
}

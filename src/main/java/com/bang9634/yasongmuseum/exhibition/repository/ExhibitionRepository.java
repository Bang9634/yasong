package com.bang9634.yasongmuseum.exhibition.repository;

import com.bang9634.yasongmuseum.exhibition.entity.Exhibition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {

    /**
     * Find exhibitions with pagination and filtering
     */
    @Query("""
        SELECT e FROM Exhibition e
        WHERE (:search IS NULL OR 
               LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:type IS NULL OR CAST(e.type AS string) = :type)
        AND (:status IS NULL OR
             CASE 
                 WHEN :status = 'ongoing' THEN (e.startDate <= :now AND e.endDate >= :now)
                 WHEN :status = 'upcoming' THEN (e.startDate > :now)
                 WHEN :status = 'past' THEN (e.endDate < :now)
                 ELSE TRUE
             END)
        ORDER BY e.startDate DESC
        """)
    Page<Exhibition> findFiltered(
        @Param("search") String search,
        @Param("type") String type,
        @Param("status") String status,
        @Param("now") LocalDateTime now,
        Pageable pageable
    );
}

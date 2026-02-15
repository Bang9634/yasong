package com.bang9634.yasongmuseum.collection.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bang9634.yasongmuseum.collection.entity.ArtCollection;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<ArtCollection, Long>{

    /**
     * Find collections with pagination and filtering
     * Year filtering extracts first 4 digits from year string 
     * Examples: "1999년" -> 1999, "1992년-1994년" -> 1992, "1999년중반-2001년후반" -> 1999
     */
    @Query(value = """
        SELECT c.* FROM collections c
        WHERE (:search IS NULL OR 
               LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(c.artist) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(c.year) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:yearFrom IS NULL OR 
             CAST(LEFT(REGEXP_REPLACE(c.year, '[^0-9]', ''), 4) AS UNSIGNED) >= CAST(:yearFrom AS UNSIGNED))
        AND (:yearTo IS NULL OR 
             CAST(LEFT(REGEXP_REPLACE(c.year, '[^0-9]', ''), 4) AS UNSIGNED) <= CAST(:yearTo AS UNSIGNED))
        ORDER BY c.is_pinned DESC, c.created_at DESC
        """, nativeQuery = true)
    Page<ArtCollection> findFiltered(
        @Param("search") String search,
        @Param("yearFrom") String yearFrom,
        @Param("yearTo") String yearTo,
        Pageable pageable
    );

    /**
     * Get random collections (for recommendations)
     * Excludes specified collection ID (e.g., currently viewing collection)
     * Uses Pageable to handle LIMIT clause in standard way
     */
    @Query(value = "SELECT * FROM collections WHERE (:excludeId IS NULL OR id != :excludeId) ORDER BY RAND()", nativeQuery = true)
    List<ArtCollection> findRandomCollections(@Param("excludeId") Long excludeId, Pageable pageable);
}

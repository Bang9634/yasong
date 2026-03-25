package com.bang9634.yasongmuseum.photo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bang9634.yasongmuseum.photo.entity.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    
    /**
     * Find photos with pagination and filtering
     * 
     * @param search Search keyword (title, description)
     * @param pageable Pagination information
     * @return Page of photos
     */
    @Query("""
        SELECT p FROM Photo p
        WHERE (:search IS NULL OR 
               LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
               LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY p.createdAt DESC
        """)
    Page<Photo> findFiltered(
        @Param("search") String search,
        Pageable pageable
    );
}

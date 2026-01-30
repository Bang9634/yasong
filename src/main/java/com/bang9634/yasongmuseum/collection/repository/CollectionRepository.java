package com.bang9634.yasongmuseum.collection.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bang9634.yasongmuseum.collection.entity.ArtCollection;

import java.util.List;

@Repository
public interface CollectionRepository extends JpaRepository<ArtCollection, Long>{

    /**
     * Find all collections ordered by pinned status (pinned first) and creation date
     */
    List<ArtCollection> findAllByOrderByIsPinnedDescCreatedAtDesc();
}

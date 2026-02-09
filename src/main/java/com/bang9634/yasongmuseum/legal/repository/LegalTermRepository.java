package com.bang9634.yasongmuseum.legal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bang9634.yasongmuseum.legal.entity.LegalTerm;
import com.bang9634.yasongmuseum.legal.entity.TermType;

public interface LegalTermRepository extends JpaRepository<LegalTerm, Long> {
    
    /**
     * Find currently active term by type
     */
    Optional<LegalTerm> findByTypeAndIsActiveTrue(TermType type);
    
    /**
     * Find all terms by type ordered by startDate descending
     */
    List<LegalTerm> findByTypeOrderByStartDateDesc(TermType type);
    
    /**
     * Deactivate all active terms of a specific type
     */
    @Modifying
    @Query("UPDATE LegalTerm t SET t.isActive = false WHERE t.type = :type AND t.isActive = true")
    void deactivateAllByType(@Param("type") TermType type);
}

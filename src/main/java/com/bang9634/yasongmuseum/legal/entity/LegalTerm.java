package com.bang9634.yasongmuseum.legal.entity;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Legal Term Entity
 * Manages Terms of Service and Privacy Policy with versioning
 */
@Entity
@Table(name = "legal_terms")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalTerm extends BaseEntity {
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TermType type;

    @Column(nullable = false, length = 50)
    private String version;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = false;
}

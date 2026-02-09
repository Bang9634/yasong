package com.bang9634.yasongmuseum.updatelog.entity;

import java.time.LocalDate;

import com.bang9634.yasongmuseum.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Update Log Entity
 * Manages website update history and release notes
 */
@Entity
@Table(name = "update_logs")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLog extends BaseEntity {
    
    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 50)
    private String version;

    @Column(nullable = false)
    private LocalDate updateDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
}

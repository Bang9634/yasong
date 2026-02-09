package com.bang9634.yasongmuseum.exhibition.entity;

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

@Entity
@Table(name = "exhibitions")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exhibition extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String location;
    
    @Column(nullable = false, length = 1000)
    private String imageUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "exhibition_type", length = 20, nullable = false)
    private ExhibitionType type;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    /**
     * Calculate exhibition status based on current date
     */
    public ExhibitionStatus getStatus() {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(startDate)) {
            return ExhibitionStatus.UPCOMING;
        } else if (now.isAfter(endDate)) {
            return ExhibitionStatus.PAST;
        } else {
            return ExhibitionStatus.ONGOING;
        }
    }
}

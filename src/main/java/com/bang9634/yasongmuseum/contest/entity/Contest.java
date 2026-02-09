package com.bang9634.yasongmuseum.contest.entity;

import java.time.LocalDateTime;

import com.bang9634.yasongmuseum.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contests")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contest extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String location;
    
    @Column(nullable = false, length = 1000)
    private String imageUrl;
        
    @Column(nullable = false, length = 1000)
    private String host;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 1000)
    private String announcementUrl;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    /**
     * Calculate contest status based on current date
     */
    public ContestStatus getStatus() {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(startDate)) {
            return ContestStatus.UPCOMING;
        } else if (now.isAfter(endDate)) {
            return ContestStatus.PAST;
        } else {
            return ContestStatus.ONGOING;
        }
    }
}

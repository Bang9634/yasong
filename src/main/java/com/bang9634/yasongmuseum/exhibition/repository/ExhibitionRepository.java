package com.bang9634.yasongmuseum.exhibition.repository;

import com.bang9634.yasongmuseum.exhibition.entity.Exhibition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {

    /**
     * Find all exhibitions ordered by start date descending
     */
    List<Exhibition> findAllByOrderByStartDateDesc();

    /**
     * Find ongoing exhibitions (current date between start and end date)
     */
    List<Exhibition> findByStartDateBeforeAndEndDateAfter(LocalDateTime now1, LocalDateTime now2);

    /**
     * Find upcoming exhibitions (start date after current date)
     */
    List<Exhibition> findByStartDateAfterOrderByStartDateAsc(LocalDateTime now);

    /**
     * Find past exhibitions (end date before current date)
     */
    List<Exhibition> findByEndDateBeforeOrderByEndDateDesc(LocalDateTime now);
}

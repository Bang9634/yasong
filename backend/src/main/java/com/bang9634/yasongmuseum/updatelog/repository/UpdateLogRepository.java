package com.bang9634.yasongmuseum.updatelog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bang9634.yasongmuseum.updatelog.entity.UpdateLog;

public interface UpdateLogRepository extends JpaRepository<UpdateLog, Long> {
    
    /**
     * Find all update logs with pagination, ordered by updateDate descending
     */
    Page<UpdateLog> findAllByOrderByUpdateDateDesc(Pageable pageable);
}

package com.bang9634.yasongmuseum.notice.repository;

import com.bang9634.yasongmuseum.notice.entity.NoticeAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeAttachmentRepository extends JpaRepository<NoticeAttachment, Long> {
    
    List<NoticeAttachment> findByNoticeId(Long noticeId);
    
    void deleteByNoticeId(Long noticeId);
}

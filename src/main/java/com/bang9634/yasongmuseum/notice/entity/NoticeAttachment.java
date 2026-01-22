package com.bang9634.yasongmuseum.notice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notice_attachments")
public class NoticeAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "notice_id")
    private Notice notice;

    private String fileName;
    private String fileUrl;
    private Long fileSize;
    private String contentType;
}

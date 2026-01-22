package com.bang9634.yasongmuseum.notice.dto;

import com.bang9634.yasongmuseum.notice.entity.NoticeCategory;
import com.bang9634.yasongmuseum.notice.entity.NoticeStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateNoticeRequest {
    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다.")
    private String title;

    private String content;

    private NoticeCategory category;

    private Boolean isPinned;

    private NoticeStatus status;

}

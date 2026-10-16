package com.bang9634.yasongmuseum.notice.dto;

import com.bang9634.yasongmuseum.notice.entity.NoticeCategory;
import com.bang9634.yasongmuseum.notice.entity.NoticeStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateNoticeRequest {
    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @NotNull(message = "카테고리는 필수입니다.")
    private NoticeCategory category;

    private Boolean isPinned = false;

    private NoticeStatus status = NoticeStatus.PUBLISHED;
}

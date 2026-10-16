package com.bang9634.yasongmuseum.common.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.bang9634.yasongmuseum.common.service.UploadStoragePaths;
import com.bang9634.yasongmuseum.contest.entity.ContestAttachment;
import com.bang9634.yasongmuseum.contest.repository.ContestAttachmentRepository;
import com.bang9634.yasongmuseum.notice.entity.NoticeAttachment;
import com.bang9634.yasongmuseum.notice.exception.NoticeNotFoundException;
import com.bang9634.yasongmuseum.notice.repository.NoticeAttachmentRepository;

class FileDownloadControllerTest {
    @TempDir
    Path root;

    @Test
    void bothAttachmentTypesReadTheConfiguredStorageRoot() throws Exception {
        Files.createDirectories(root.resolve("notices"));
        byte[] expected = "download from configured storage".getBytes();
        Files.write(root.resolve("notices/guide.pdf"), expected);
        var notices = mock(NoticeAttachmentRepository.class);
        var contests = mock(ContestAttachmentRepository.class);
        var controller = new FileDownloadController(notices, contests, new UploadStoragePaths(root.toString()));
        when(notices.findById(1L)).thenReturn(Optional.of(NoticeAttachment.builder()
            .fileUrl("/uploads/notices/guide.pdf").fileName("guide.pdf").contentType("application/pdf").fileSize((long) expected.length).build()));
        when(contests.findById(2L)).thenReturn(Optional.of(ContestAttachment.builder()
            .fileUrl("/uploads/notices/guide.pdf").fileName("guide.pdf").contentType("application/pdf").fileSize((long) expected.length).build()));

        try (var notice = controller.downloadAttachment(1L).getBody().getInputStream();
             var contest = controller.downloadContestAttachment(2L).getBody().getInputStream()) {
            assertArrayEquals(expected, notice.readAllBytes());
            assertArrayEquals(expected, contest.readAllBytes());
        }
    }

    @Test
    void anAttachmentCannotReadOutsideUploads() throws Exception {
        var notices = mock(NoticeAttachmentRepository.class);
        var controller = new FileDownloadController(notices, mock(ContestAttachmentRepository.class), new UploadStoragePaths(root.toString()));
        when(notices.findById(1L)).thenReturn(Optional.of(NoticeAttachment.builder().fileUrl("/uploads/../private.key").build()));
        assertThrows(NoticeNotFoundException.class, () -> controller.downloadAttachment(1L));
    }
}

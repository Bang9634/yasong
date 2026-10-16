package com.bang9634.yasongmuseum.common.service;

import static org.junit.jupiter.api.Assertions.*;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

class UploadStoragePathsTest {

    @TempDir
    Path temporary;

    @Test
    void absoluteStorageRootDoesNotLeakIntoPublicUrlsAndDeletionUsesTheSameRoot() throws Exception {
        UploadStoragePaths paths = new UploadStoragePaths(temporary.resolve("storage with spaces").toString());
        FileStorageService storage = new FileStorageService(paths);
        byte[] body = "image bytes".getBytes();
        String url = storage.saveFile(new MockMultipartFile("file", "sample.png", "image/png", body), "hero", "hero-");

        assertTrue(url.startsWith("/uploads/hero/hero-"));
        assertFalse(url.contains(temporary.toString()));
        assertArrayEquals(body, Files.readAllBytes(paths.resolveUrl(url)));
        assertTrue(paths.getResourceLocation().endsWith("/"));
        assertTrue(paths.getResourceLocation().contains("%20"));

        storage.deleteFile(url);
        assertFalse(Files.exists(paths.resolveUrl(url)));
    }

    @Test
    void legacyRelativeUrlsResolveToTheConfiguredRoot() {
        UploadStoragePaths paths = new UploadStoragePaths(temporary.toString());
        Path expected = temporary.resolve("notices/document.pdf");
        assertEquals(expected, paths.resolveUrl("/uploads/notices/document.pdf"));
        assertEquals(expected, paths.resolveUrl("uploads/notices/document.pdf"));
    }

    @Test
    void traversalAndNonUploadUrlsAreRejected() {
        UploadStoragePaths paths = new UploadStoragePaths(temporary.toString());
        for (String url : new String[] {"/uploads/../private.key", "/uploads/hero/../../private.key", "/uploads/", "/etc/passwd", "https://example.com/file"}) {
            assertThrows(IllegalArgumentException.class, () -> paths.resolveUrl(url));
        }
        assertThrows(IllegalArgumentException.class, () -> paths.resolveRelative("/etc/passwd"));
    }

    @Test
    void invalidDeletionCannotRemoveFilesOutsideUploads() throws Exception {
        Path outside = Files.writeString(temporary.resolve("keep.txt"), "keep");
        FileStorageService storage = new FileStorageService(new UploadStoragePaths(temporary.resolve("uploads").toString()));
        storage.deleteFile("/uploads/../keep.txt");
        assertTrue(Files.exists(outside));
    }

    @Test
    void documentsUseTheSameStablePublicPrefix() throws Exception {
        UploadStoragePaths paths = new UploadStoragePaths(temporary.toString());
        FileStorageService storage = new FileStorageService(paths);
        String url = storage.saveDocumentFile(new MockMultipartFile("file", "guide.pdf", "application/pdf", "pdf bytes".getBytes()), "notices", "notice-");
        assertTrue(url.startsWith("/uploads/notices/notice-"));
        assertTrue(Files.exists(paths.resolveUrl(url)));
    }
}

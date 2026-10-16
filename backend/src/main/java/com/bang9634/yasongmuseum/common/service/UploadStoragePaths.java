package com.bang9634.yasongmuseum.common.service;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Keeps physical storage paths separate from the public /uploads/ URL. */
@Component
public class UploadStoragePaths {

    public static final String URL_PREFIX = "/uploads/";
    private final Path root;

    public UploadStoragePaths(@Value("${file.upload.dir:uploads}") String directory) {
        if (directory == null || directory.isBlank()) {
            throw new IllegalArgumentException("Upload directory must not be empty");
        }
        this.root = Path.of(directory).toAbsolutePath().normalize();
    }

    public Path getRoot() {
        return root;
    }

    public String getResourceLocation() {
        String location = root.toUri().toString();
        return location.endsWith("/") ? location : location + "/";
    }

    public Path resolveRelative(String relative) {
        Path path = Path.of(relative);
        Path resolved = root.resolve(path).normalize();
        if (path.isAbsolute() || resolved.equals(root) || !resolved.startsWith(root)) {
            throw new IllegalArgumentException("Path is outside the upload directory");
        }
        return resolved;
    }

    public Path resolveUrl(String url) {
        if (url == null) {
            throw new IllegalArgumentException("Upload URL is missing");
        }
        String normalized = url.startsWith("/") ? url : "/" + url;
        if (!normalized.startsWith(URL_PREFIX)) {
            throw new IllegalArgumentException("Invalid upload URL");
        }
        return resolveRelative(normalized.substring(URL_PREFIX.length()));
    }
}

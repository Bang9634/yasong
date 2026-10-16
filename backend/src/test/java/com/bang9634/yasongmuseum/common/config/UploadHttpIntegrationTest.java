package com.bang9634.yasongmuseum.common.config;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.bang9634.yasongmuseum.common.service.FileStorageService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UploadHttpIntegrationTest {
    private static final Path UPLOAD_ROOT = temporaryDirectory();

    private static Path temporaryDirectory() {
        try {
            return Files.createTempDirectory("yasong-upload-test-");
        } catch (IOException error) {
            throw new ExceptionInInitializerError(error);
        }
    }

    @DynamicPropertySource
    static void configureStorage(DynamicPropertyRegistry properties) {
        properties.add("file.upload.dir", UPLOAD_ROOT::toString);
        properties.add("server.address", () -> "127.0.0.1");
    }

    @Value("${local.server.port}")
    int port;

    @Autowired
    FileStorageService storage;

    @AfterAll
    static void cleanTemporaryUploads() throws IOException {
        try (var paths = Files.walk(UPLOAD_ROOT)) {
            for (Path path : paths.sorted(Comparator.reverseOrder()).toList()) {
                Files.deleteIfExists(path);
            }
        }
    }

    @Test
    void aSavedImageIsServedFromTheConfiguredDirectory() throws Exception {
        byte[] expected = "temporary image content".getBytes();
        String url = storage.saveFile(new MockMultipartFile("file", "test.png", "image/png", expected), "hero", "hero-");
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + url)).GET().build();
        var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofByteArray());
        assertEquals(200, response.statusCode());
        assertArrayEquals(expected, response.body());
        assertEquals("image/png", response.headers().firstValue("Content-Type").orElse(""));
    }

    @Test
    void theViteDevelopmentOriginCanPreflightAuthenticatedUploads() throws Exception {
        var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/api/management/website/images/hero"))
            .method("OPTIONS", HttpRequest.BodyPublishers.noBody())
            .header("Origin", "http://localhost:5173")
            .header("Access-Control-Request-Method", "POST")
            .header("Access-Control-Request-Headers", "authorization")
            .build();
        var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        assertEquals(200, response.statusCode());
        assertEquals("http://localhost:5173", response.headers().firstValue("Access-Control-Allow-Origin").orElse(""));
    }
}

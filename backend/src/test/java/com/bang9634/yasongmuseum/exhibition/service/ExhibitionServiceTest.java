package com.bang9634.yasongmuseum.exhibition.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockMultipartFile;

import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.exhibition.dto.CreateExhibitionRequest;
import com.bang9634.yasongmuseum.exhibition.dto.UpdateExhibitionRequest;
import com.bang9634.yasongmuseum.exhibition.entity.Exhibition;
import com.bang9634.yasongmuseum.exhibition.entity.ExhibitionType;
import com.bang9634.yasongmuseum.exhibition.repository.ExhibitionRepository;

class ExhibitionServiceTest {
    private static final LocalDateTime START = LocalDateTime.of(2030, 1, 1, 0, 0);
    private static final LocalDateTime END = START.plusDays(10);

    private ExhibitionRepository repository;
    private FileStorageService storage;
    private ExhibitionService service;

    @BeforeEach
    void setUp() {
        repository = mock(ExhibitionRepository.class);
        storage = mock(FileStorageService.class);
        service = new ExhibitionService(repository, storage);
    }

    @ParameterizedTest
    @EnumSource(ExhibitionType.class)
    void creationPersistsAndReturnsEachExhibitionType(ExhibitionType type) {
        var image = new MockMultipartFile("image", "poster.webp", "image/webp", new byte[] {1});
        var request = new CreateExhibitionRequest("전시", "장소", "설명", type, START, END);
        when(storage.saveFile(image, "exhibitions", "exhibition-"))
            .thenReturn("/uploads/exhibitions/poster.webp");
        when(repository.save(any(Exhibition.class))).thenAnswer(invocation -> {
            Exhibition saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        var response = service.createExhibition(request, image);

        assertEquals(type, response.getType());
        assertEquals("/uploads/exhibitions/poster.webp", response.getImageUrl());
        verify(repository).save(argThat(saved -> saved.getType() == type));
    }

    @Test
    void changingAnExistingExhibitionToGeneralKeepsItsImageWhenNoImageIsUploaded() {
        var existing = exhibition(ExhibitionType.RETROSPECTIVE);
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        var request = new UpdateExhibitionRequest(
            "일반 전시", "장소", "설명", ExhibitionType.GENERAL, START, END);

        var response = service.updateExhibition(1L, request, null);

        assertEquals(ExhibitionType.GENERAL, existing.getType());
        assertEquals(ExhibitionType.GENERAL, response.getType());
        assertEquals("/uploads/exhibitions/existing.webp", response.getImageUrl());
        verifyNoInteractions(storage);
    }

    @Test
    void generalFilterIsCombinedWithSearchStatusAndPagination() {
        var pageable = PageRequest.of(1, 10);
        when(repository.findFiltered(eq("전시"), eq("GENERAL"), eq("upcoming"),
                any(LocalDateTime.class), eq(pageable)))
            .thenReturn(new PageImpl<>(List.of(exhibition(ExhibitionType.GENERAL)), pageable, 11));

        var response = service.getExhibitions(2, 10, "전시", "GENERAL", "upcoming");

        assertEquals(2, response.getPage());
        assertEquals(11, response.getTotalElements());
        assertEquals(ExhibitionType.GENERAL, response.getContent().getFirst().getType());
        verify(repository).findFiltered(eq("전시"), eq("GENERAL"), eq("upcoming"),
            any(LocalDateTime.class), eq(pageable));
    }

    private Exhibition exhibition(ExhibitionType type) {
        var exhibition = Exhibition.builder()
            .title("전시")
            .location("장소")
            .description("설명")
            .imageUrl("/uploads/exhibitions/existing.webp")
            .type(type)
            .startDate(START)
            .endDate(END)
            .build();
        exhibition.setId(1L);
        return exhibition;
    }
}

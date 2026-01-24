package com.bang9634.yasongmuseum.souvenir.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bang9634.yasongmuseum.common.service.FileStorageService;
import com.bang9634.yasongmuseum.souvenir.dto.CreateSouvenirRequest;
import com.bang9634.yasongmuseum.souvenir.dto.SouvenirResponse;
import com.bang9634.yasongmuseum.souvenir.dto.UpdateSouvenirRequest;
import com.bang9634.yasongmuseum.souvenir.entity.Souvenir;
import com.bang9634.yasongmuseum.souvenir.exception.SouvenirNotFoundException;
import com.bang9634.yasongmuseum.souvenir.repository.SouvenirRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SouvenirService {
    
    private final SouvenirRepository souvenirRepository;
    private final FileStorageService fileStorageService;

    private static final String IMAGE_DIRECTORY = "souvenirs";
    private static final String IMAGE_PREFIX = "souvenir-";

    @Transactional(readOnly = true)
    public List<SouvenirResponse> getAllSouvenirs() {
        return souvenirRepository.findAllByOrderByIsPinnedDescCreatedAtDesc().stream()
                .map(SouvenirResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SouvenirResponse getSouvenirById(Long id) {
        Souvenir souvenir = souvenirRepository.findById(id)
                .orElseThrow(() -> new SouvenirNotFoundException(id));
        return SouvenirResponse.from(souvenir);
    }

    public SouvenirResponse createSouvenir(CreateSouvenirRequest request, MultipartFile imageFile) {
        // 이미지 파일 업로드
        String imageUrl = fileStorageService.saveFile(imageFile, IMAGE_DIRECTORY, IMAGE_PREFIX);

        // 기념품 생성
        Souvenir souvenir = Souvenir.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .isPinned(request.getIsPinned() != null ? request.getIsPinned() : false)
                .imageUrl(imageUrl)
                .build();

        Souvenir savedSouvenir = souvenirRepository.save(souvenir);
        log.info("기념품 생성 완료: {}", savedSouvenir.getId());

        return SouvenirResponse.from(savedSouvenir);
    }

    public SouvenirResponse updateSouvenir(Long id, UpdateSouvenirRequest request, MultipartFile imageFile) {
        Souvenir souvenir = souvenirRepository.findById(id)
                .orElseThrow(() -> new SouvenirNotFoundException(id));

        // 이미지 파일이 있으면 업데이트
        if (imageFile != null && !imageFile.isEmpty()) {
            // 기존 이미지 삭제
            fileStorageService.deleteFile(souvenir.getImageUrl());
            // 새 이미지 저장
            String newImageUrl = fileStorageService.saveFile(imageFile, IMAGE_DIRECTORY, IMAGE_PREFIX);
            souvenir.setImageUrl(newImageUrl);
        }

        // 기념품 정보 업데이트
        if (request.getName() != null) {
            souvenir.setName(request.getName());
        }
        if (request.getDescription() != null) {
            souvenir.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            souvenir.setPrice(request.getPrice());
        }
        if (request.getIsPinned() != null) {
            souvenir.setIsPinned(request.getIsPinned());
        }

        Souvenir updatedSouvenir = souvenirRepository.save(souvenir);
        log.info("기념품 수정 완료: {}", updatedSouvenir.getId());

        return SouvenirResponse.from(updatedSouvenir);
    }

    public void deleteSouvenir(Long id) {
        Souvenir souvenir = souvenirRepository.findById(id)
                .orElseThrow(() -> new SouvenirNotFoundException(id));

        // 이미지 파일 삭제
        fileStorageService.deleteFile(souvenir.getImageUrl());

        // 기념품 삭제
        souvenirRepository.delete(souvenir);
        log.info("기념품 삭제 완료: {}", id);
    }
}

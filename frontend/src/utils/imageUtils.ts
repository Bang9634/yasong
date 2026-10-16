/**
 * 이미지 리사이징 유틸리티 함수
 */

/**
 * 이미지를 지정된 최대 크기로 리사이징
 * @param file - 원본 이미지 파일
 * @param maxWidth - 최대 너비
 * @param maxHeight - 최대 높이
 * @param quality - JPEG 품질 (0.0 ~ 1.0, 기본값 0.9)
 * @returns 리사이징된 이미지 파일
 */
export const resizeImage = (
  file: File, 
  maxWidth: number, 
  maxHeight: number,
  quality: number = 0.9
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // 비율 유지하면서 리사이징
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      // Canvas로 리사이징
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // 파일명에서 확장자 제거 후 .webp 추가
      const fileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';

      // Canvas를 WebP Blob으로 변환
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          // Blob을 File 객체로 변환 (WebP 형식)
          const resizedFile = new File([blob], fileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 파일을 Data URL로 변환
 * @param file - 이미지 파일
 * @returns Data URL Promise
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * 파일 크기 포맷팅
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * 파일 확장자 가져오기
 */
export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * 파일 타입 아이콘 판별
 */
export const getFileTypeIcon = (contentType: string, fileName: string): 'pdf' | 'doc' | 'excel' | 'ppt' | 'archive' | 'file' => {
  // Content-Type 기반 판별
  if (contentType.includes('pdf')) return 'pdf';
  if (contentType.includes('word') || contentType.includes('hwp')) return 'doc';
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'excel';
  if (contentType.includes('powerpoint') || contentType.includes('presentation')) return 'ppt';
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('7z')) return 'archive';

  // 파일 확장자 기반 판별
  const ext = getFileExtension(fileName);
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'hwp', 'hwpx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  if (['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';

  return 'file';
};

/**
 * 파일 다운로드 처리
 */
export const downloadFile = async (downloadUrl: string, fileName: string) => {
  try {
    if (import.meta.env.DEV) {
      console.group('🔽 [파일 다운로드]');
      console.log('파일명:', fileName);
      console.log('다운로드 URL:', downloadUrl);
    }

    const response = await fetch(downloadUrl);

    if (import.meta.env.DEV) {
      console.log('응답 상태:', response.status, response.statusText);
      console.log('Content-Type:', response.headers.get('Content-Type'));
      console.log('Content-Length:', response.headers.get('Content-Length'));
    }

    if (!response.ok) throw new Error('다운로드 실패');

    const blob = await response.blob();

    if (import.meta.env.DEV) {
      console.log('Blob 생성:', blob.size, 'bytes, type:', blob.type);
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    if (import.meta.env.DEV) {
      console.log('✅ 다운로드 완료:', fileName);
      console.groupEnd();
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ 파일 다운로드 실패:', error);
      console.groupEnd();
    }
    throw error;
  }
};

/**
 * 파일 크기 검증
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * 파일 타입 검증 (문서 파일)
 */
export const isValidDocumentFile = (file: File): boolean => {
  const validExtensions = [
    'pdf', 'doc', 'docx', 'hwp', 'hwpx',
    'xls', 'xlsx', 'ppt', 'pptx',
    'txt', 'zip', 'rar', '7z'
  ];
  
  const ext = getFileExtension(file.name);
  return validExtensions.includes(ext);
};

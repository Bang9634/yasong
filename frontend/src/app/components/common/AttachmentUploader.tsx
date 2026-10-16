import React from 'react';
import { FileText, Upload, X, Paperclip } from 'lucide-react';
import { formatFileSize } from '@/utils/fileUtils';
import { Button } from '@/app/components/ui/button';

export interface UploadedAttachment {
  id: number;
  fileName: string;
  fileUrl?: string;
  downloadUrl?: string;
  fileSize: number;
  contentType: string;
  uploadedAt?: string;
}

interface AttachmentUploaderProps {
  // 이미 업로드된 첨부파일 (서버에서 가져온 것)
  uploaded: UploadedAttachment[];
  // 업로드 대기중인 파일 (아직 저장 안됨)
  pending: File[];
  // 업로드 중인지 여부
  isUploading: boolean;
  // 수정 모드인지 여부
  isEditMode: boolean;
  // 저장된 ID (수정 모드에서만 사용)
  savedId?: string;
  // 핸들러
  onAddPending: (file: File) => void;
  onRemovePending: (index: number) => void;
  onUploadFile: (file: File) => Promise<void>;
  onDeleteUploaded: (id: number) => Promise<void>;
  // 테마
  theme?: 'light' | 'dark';
}

export function AttachmentUploader({
  uploaded,
  pending,
  isUploading,
  isEditMode,
  savedId,
  onAddPending,
  onRemovePending,
  onUploadFile,
  onDeleteUploaded,
  theme = 'light'
}: AttachmentUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const themeClasses = theme === 'dark'
    ? {
        sectionBg: 'bg-white/5',
        borderColor: 'border-white/20',
        titleText: 'text-white',
        descText: 'text-white/60',
        itemBg: 'bg-white/10',
        itemText: 'text-white',
        itemSizeText: 'text-white/60',
        buttonIconColor: 'text-white/60 hover:text-white',
        pendingBg: 'bg-white/5 border-white/20',
        pendingText: 'text-white/70',
      }
    : {
        sectionBg: 'bg-gray-50',
        borderColor: 'border-gray-300',
        titleText: 'text-[#2C2C2C]',
        descText: 'text-gray-600',
        itemBg: 'bg-white',
        itemText: 'text-[#2C2C2C]',
        itemSizeText: 'text-gray-500',
        buttonIconColor: 'text-gray-600 hover:text-red-600',
        pendingBg: 'bg-blue-50 border-blue-200',
        pendingText: 'text-blue-800',
      };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Notice와 동일한 검증: 파일 크기만 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      e.target.value = '';
      return;
    }

    // 중복 체크
    if (pending.some(f => f.name === file.name && f.size === file.size)) {
      alert('이미 추가된 파일입니다.');
      e.target.value = '';
      return;
    }

    // 수정 모드이고 ID가 있으면 바로 업로드
    if (isEditMode && savedId) {
      onUploadFile(file);
    } else {
      // 신규 작성 모드면 임시 목록에 추가
      onAddPending(file);
    }

    e.target.value = '';
  };

  return (
    <div className={`p-4 rounded-lg ${themeClasses.sectionBg} border ${themeClasses.borderColor}`}>
      <div className="flex items-center justify-between mb-3">
        <label className={`text-sm font-medium ${themeClasses.titleText} flex items-center gap-2`}>
          <Paperclip className="w-4 h-4" />
          첨부파일
        </label>
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
          variant="outline"
        >
          <Upload className="w-4 h-4 mr-1" />
          {isUploading ? '업로드 중...' : '파일 선택'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <p className={`text-xs ${themeClasses.descText} mb-3`}>
        모든 파일 형식 지원 (최대 10MB)
      </p>

      {/* 이미 업로드된 첨부파일 */}
      {uploaded.length > 0 && (
        <div className="space-y-2 mb-3">
          {uploaded.map((file) => (
            <div
              key={file.id}
              className={`flex items-center justify-between p-2 rounded border ${themeClasses.borderColor} ${themeClasses.itemBg}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${themeClasses.itemText} truncate`}>
                    {file.fileName}
                  </p>
                  <p className={`text-xs ${themeClasses.itemSizeText}`}>
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDeleteUploaded(file.id)}
                className={`p-1 ${themeClasses.buttonIconColor} transition-colors`}
                title="삭제"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 대기중인 파일 */}
      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map((file, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded border ${themeClasses.pendingBg}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Upload className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${themeClasses.pendingText} truncate`}>
                    {file.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    {formatFileSize(file.size)} • 저장 시 업로드됨
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemovePending(index)}
                className="p-1 text-blue-600 hover:text-red-600 transition-colors"
                title="제거"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploaded.length === 0 && pending.length === 0 && (
        <p className={`text-sm ${themeClasses.descText} text-center py-2`}>
          첨부파일이 없습니다
        </p>
      )}
    </div>
  );
}

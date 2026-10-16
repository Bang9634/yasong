import { formatFileSize } from '@/utils/fileUtils';
import { Label } from '@/components/ui/label';
import { getFullImageUrl } from '@/utils/api';
import { FileText, Upload, X, Download, Paperclip } from 'lucide-react';
import type { useNoticeEditor } from '../hooks/useNoticeEditor';

type NoticeAttachmentFieldsProps = Pick<
  ReturnType<typeof useNoticeEditor>,
  | 'uploadingFile'
  | 'handleFileUpload'
  | 'handleAddPendingFile'
  | 'pendingFiles'
  | 'handleRemovePendingFile'
  | 'attachments'
  | 'handleDeleteAttachment'
> & {
  isEdit: boolean;
  noticeId: string | null;
};

export function NoticeAttachmentFields({
  isEdit,
  noticeId,
  uploadingFile,
  handleFileUpload,
  handleAddPendingFile,
  pendingFiles,
  handleRemovePendingFile,
  attachments,
  handleDeleteAttachment,
}: NoticeAttachmentFieldsProps) {
  return (
    <>
      <div className="border-t border-[#2C2C2C]/20 pt-8">
        <Label className="text-[#2C2C2C] font-semibold text-base mb-4 block flex items-center">
          <Paperclip className="w-5 h-5 mr-2" />
          첨부파일 {!isEdit && '(공지사항 저장 시 함께 업로드됩니다)'}
        </Label>

        {/* 첨부파일 추가 */}
        <div className="mb-4">
          <label className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-[#2C2C2C]/20 rounded-lg cursor-pointer hover:border-[#C84630] hover:bg-[#C84630]/5 transition-colors">
            <Upload className="w-5 h-5 mr-2 text-[#2C2C2C]/60" />
            <span className="text-sm text-[#2C2C2C]/80 font-medium">
              {isEdit && noticeId
                ? uploadingFile
                  ? '업로드 중...'
                  : '파일 추가 (최대 10MB)'
                : '파일 선택 (최대 10MB)'}
            </span>
            <input
              type="file"
              onChange={isEdit && noticeId ? handleFileUpload : handleAddPendingFile}
              disabled={uploadingFile}
              className="hidden"
              accept=".pdf,.hwp,.hwpx,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png,.gif,.webp"
            />
          </label>
          <p className="text-xs text-[#2C2C2C]/50 mt-2">
            지원 형식: PDF, HWP, HWPX, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, 이미지
          </p>
        </div>

        {/* 임시 첨부파일 목록 (신규 작성 시) */}
        {!isEdit && pendingFiles.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-sm text-[#2C2C2C]/60 font-medium mb-3">
              대기 중인 파일 ({pendingFiles.length})
            </p>
            {pendingFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#C84630]/5 rounded-lg border border-[#C84630]/20"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-[#C84630] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C2C2C] truncate">{file.name}</p>
                    <p className="text-xs text-[#2C2C2C]/50">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePendingFile(index)}
                  className="p-2 text-[#C84630] hover:bg-[#C84630]/10 rounded transition-colors"
                  title="제거"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 업로드된 첨부파일 목록 (수정 시) */}
        {isEdit && attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-[#2C2C2C]/60 font-medium mb-3">
              업로드된 파일 ({attachments.length})
            </p>
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-[#2C2C2C]/5 rounded-lg border border-[#2C2C2C]/10"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-[#2C2C2C]/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2C2C2C] truncate">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-[#2C2C2C]/50">
                      {formatFileSize(attachment.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getFullImageUrl(attachment.fileUrl)}
                    download={attachment.fileName}
                    className="p-2 text-[#2C2C2C]/60 hover:bg-[#2C2C2C]/10 hover:text-[#C84630] rounded transition-colors"
                    title="다운로드"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    className="p-2 text-[#C84630] hover:bg-[#C84630]/10 rounded transition-colors"
                    title="삭제"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

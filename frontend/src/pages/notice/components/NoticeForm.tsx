import { NoticeAttachmentFields } from './NoticeAttachmentFields';
import { NoticeBodyEditor } from './NoticeBodyEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { useNoticeEditor } from '../hooks/useNoticeEditor';

type NoticeFormProps = Pick<
  ReturnType<typeof useNoticeEditor>,
  | 'handleSubmit'
  | 'formData'
  | 'setFormData'
  | 'uploadingImage'
  | 'handleImageUpload'
  | 'contentRef'
  | 'uploadingFile'
  | 'handleFileUpload'
  | 'handleAddPendingFile'
  | 'pendingFiles'
  | 'handleRemovePendingFile'
  | 'attachments'
  | 'handleDeleteAttachment'
  | 'isSubmitting'
> & {
  isEdit: boolean;
  noticeId: string | null;
  onCancel: () => void;
};

export function NoticeForm({
  handleSubmit,
  formData,
  setFormData,
  uploadingImage,
  handleImageUpload,
  contentRef,
  isEdit,
  noticeId,
  uploadingFile,
  handleFileUpload,
  handleAddPendingFile,
  pendingFiles,
  handleRemovePendingFile,
  attachments,
  handleDeleteAttachment,
  isSubmitting,
  onCancel,
}: NoticeFormProps) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <Label htmlFor="category" className="text-[#2C2C2C] font-semibold text-base mb-2 block">
            카테고리 *
          </Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
            required
          >
            <option value="GENERAL">일반</option>
            <option value="EXHIBITION">전시</option>
            <option value="CONTEST">공모전</option>
            <option value="MAINTENANCE">시스템</option>
          </select>
        </div>
        <div>
          <Label htmlFor="title" className="text-[#2C2C2C] font-semibold text-base mb-2 block">
            제목 *
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="제목을 입력해주세요"
            className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
            required
          />
        </div>
        <NoticeBodyEditor
          uploadingImage={uploadingImage}
          handleImageUpload={handleImageUpload}
          contentRef={contentRef}
          formData={formData}
          setFormData={setFormData}
        />{' '}
        <div className="flex items-center space-x-3 p-4 bg-[#2C2C2C]/5 rounded-lg border border-[#2C2C2C]/10">
          <Checkbox
            id="isPinned"
            checked={formData.isPinned}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isPinned: checked as boolean })
            }
            className="border-[#2C2C2C]/30"
          />
          <Label htmlFor="isPinned" className="text-sm font-medium text-[#2C2C2C] cursor-pointer">
            상단 고정
          </Label>
        </div>
        <div>
          <Label htmlFor="status" className="text-[#2C2C2C] font-semibold text-base mb-2 block">
            게시 상태 *
          </Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
            required
          >
            <option value="PUBLISHED">게시됨</option>
            <option value="DRAFT">임시저장</option>
            <option value="HIDDEN">숨김</option>
          </select>
        </div>
        {/* 첨부파일 섹션 */}
        <NoticeAttachmentFields
          isEdit={isEdit}
          noticeId={noticeId}
          uploadingFile={uploadingFile}
          handleFileUpload={handleFileUpload}
          handleAddPendingFile={handleAddPendingFile}
          pendingFiles={pendingFiles}
          handleRemovePendingFile={handleRemovePendingFile}
          attachments={attachments}
          handleDeleteAttachment={handleDeleteAttachment}
        />{' '}
        <div className="flex gap-3 pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#C84630] hover:bg-[#A83820] text-[#F4F4F0] font-semibold py-3 rounded-lg transition-colors"
          >
            {isSubmitting ? '처리 중...' : isEdit ? '수정하기' : '작성하기'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#2C2C2C] hover:bg-[#2C2C2C]/90 text-[#F4F4F0] font-semibold py-3 rounded-lg transition-colors"
          >
            취소
          </Button>
        </div>
      </form>
    </>
  );
}

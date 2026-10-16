import { AttachmentUploader } from '@/components/attachments/AttachmentUploader';
import { Upload, X } from 'lucide-react';
import type { useContestEditor } from '../hooks/useContestEditor';

type ContestFormProps = Pick<
  ReturnType<typeof useContestEditor>,
  | 'handleSubmit'
  | 'imagePreview'
  | 'handleRemoveImage'
  | 'handleImageChange'
  | 'errors'
  | 'formData'
  | 'handleInputChange'
  | 'attachments'
  | 'pendingFiles'
  | 'uploadingFile'
  | 'handleAddPendingFile'
  | 'handleRemovePendingFile'
  | 'handleUploadFile'
  | 'handleDeleteAttachment'
  | 'isLoading'
> & {
  isEditMode: boolean;
  id: string | undefined;
  onCancel: () => void;
};

export function ContestForm({
  handleSubmit,
  imagePreview,
  handleRemoveImage,
  handleImageChange,
  errors,
  formData,
  handleInputChange,
  attachments,
  pendingFiles,
  uploadingFile,
  isEditMode,
  id,
  handleAddPendingFile,
  handleRemovePendingFile,
  handleUploadFile,
  handleDeleteAttachment,
  onCancel,
  isLoading,
}: ContestFormProps) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 bg-[#F4F4F0]/5 rounded-lg p-8">
        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-[#F4F4F0] mb-2">
            공모전 이미지 <span className="text-[#C84630]">*</span>
          </label>
          <p className="text-sm text-[#F4F4F0]/60 mb-4">
            포스터 형식 (3:4 비율) 권장, 최대 1200x1600px로 자동 리사이즈됩니다.
          </p>

          {imagePreview ? (
            <div className="relative w-full max-w-md">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F4F4F0]/10">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full max-w-md aspect-[3/4] border-2 border-dashed border-[#F4F4F0]/30 rounded-lg cursor-pointer hover:border-[#C84630] transition-colors bg-[#F4F4F0]/5"
              >
                <Upload className="w-12 h-12 text-[#F4F4F0]/40 mb-2" />
                <span className="text-sm text-[#F4F4F0]/60">클릭하여 이미지 업로드</span>
              </label>
            </div>
          )}
          {errors.imageFile && <p className="text-red-400 text-sm mt-2">{errors.imageFile}</p>}
        </div>

        {/* 공모전 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#F4F4F0] mb-2">
            공모전 제목 <span className="text-[#C84630]">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.title ? 'border-red-600' : 'border-[#F4F4F0]/20'
            } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
            placeholder="공모전 제목을 입력하세요"
          />
          {errors.title && <p className="text-red-400 text-sm mt-2">{errors.title}</p>}
        </div>

        {/* 주최자 */}
        <div>
          <label htmlFor="host" className="block text-sm font-medium text-[#F4F4F0] mb-2">
            주최자 <span className="text-[#C84630]">*</span>
          </label>
          <input
            type="text"
            id="host"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.host ? 'border-red-600' : 'border-[#F4F4F0]/20'
            } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
            placeholder="예: 야송미술관"
          />
          {errors.host && <p className="text-red-400 text-sm mt-2">{errors.host}</p>}
        </div>

        {/* 공모 기간 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[#F4F4F0] mb-2">
              공모 시작일 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.startDate ? 'border-red-600' : 'border-[#F4F4F0]/20'
              } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
            />
            {errors.startDate && <p className="text-red-400 text-sm mt-2">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-[#F4F4F0] mb-2">
              공모 종료일 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.endDate ? 'border-red-600' : 'border-[#F4F4F0]/20'
              } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
            />
            {errors.endDate && <p className="text-red-400 text-sm mt-2">{errors.endDate}</p>}
          </div>
        </div>

        {/* 공모 대상 */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[#F4F4F0] mb-2">
            공모 대상 <span className="text-[#C84630]">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.location ? 'border-red-600' : 'border-[#F4F4F0]/20'
            } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
            placeholder="예: 대학(원)생, 일반인 등"
          />
          {errors.location && <p className="text-red-400 text-sm mt-2">{errors.location}</p>}
        </div>

        {/* 공고 URL */}
        <div>
          <label
            htmlFor="announcementUrl"
            className="block text-sm font-medium text-[#F4F4F0] mb-2"
          >
            공고 URL <span className="text-[#C84630]">*</span>
          </label>
          <input
            type="text"
            id="announcementUrl"
            name="announcementUrl"
            value={formData.announcementUrl}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.announcementUrl ? 'border-red-600' : 'border-[#F4F4F0]/20'
            } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0]`}
            placeholder="https://example.com/contest"
          />
          {errors.announcementUrl && (
            <p className="text-red-400 text-sm mt-2">{errors.announcementUrl}</p>
          )}
        </div>

        {/* 공모전 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#F4F4F0] mb-2">
            공모전 설명 <span className="text-[#C84630]">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.description ? 'border-red-600' : 'border-[#F4F4F0]/20'
            } focus:border-[#C84630] focus:outline-none bg-[#F4F4F0]/10 text-[#F4F4F0] resize-none`}
            placeholder="공모전에 대한 설명을 입력하세요"
          />
          {errors.description && <p className="text-red-400 text-sm mt-2">{errors.description}</p>}
        </div>

        {/* 첨부파일 */}
        <AttachmentUploader
          uploaded={attachments}
          pending={pendingFiles}
          isUploading={uploadingFile}
          isEditMode={isEditMode}
          savedId={id}
          onAddPending={handleAddPendingFile}
          onRemovePending={handleRemovePendingFile}
          onUploadFile={handleUploadFile}
          onDeleteUploaded={handleDeleteAttachment}
          theme="dark"
        />

        {/* 버튼 */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => onCancel()}
            className="flex-1 px-6 py-3 bg-[#F4F4F0]/10 hover:bg-[#F4F4F0]/20 transition-colors rounded-lg text-[#F4F4F0] font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#C84630] hover:bg-[#A33520] transition-colors rounded-lg text-[#F4F4F0] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '저장 중...' : isEditMode ? '수정하기' : '등록하기'}
          </button>
        </div>
      </form>
    </>
  );
}

import { EXHIBITION_TYPE_OPTIONS } from '@/utils/exhibitionTypes';
import { Upload, X } from 'lucide-react';
import type { useExhibitionEditor } from '../hooks/useExhibitionEditor';

type ExhibitionFormProps = Pick<
  ReturnType<typeof useExhibitionEditor>,
  | 'handleSubmit'
  | 'imagePreview'
  | 'handleRemoveImage'
  | 'handleImageChange'
  | 'errors'
  | 'formData'
  | 'handleInputChange'
  | 'isLoading'
> & {
  onCancel: () => void;
  isEditMode: boolean;
};

export function ExhibitionForm({
  handleSubmit,
  imagePreview,
  handleRemoveImage,
  handleImageChange,
  errors,
  formData,
  handleInputChange,
  onCancel,
  isLoading,
  isEditMode,
}: ExhibitionFormProps) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg p-8">
        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
            전시 이미지 <span className="text-[#C84630]">*</span>
          </label>
          <p className="text-sm text-[#2C2C2C]/60 mb-4">
            포스터 형식 (3:4 비율) 권장, 최대 1200x1600px로 자동 리사이즈됩니다.
          </p>

          {imagePreview ? (
            <div className="relative w-full max-w-md">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#2C2C2C]/10">
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
                className="flex flex-col items-center justify-center w-full max-w-md aspect-[3/4] border-2 border-dashed border-[#2C2C2C]/30 rounded-lg cursor-pointer hover:border-[#C84630] transition-colors bg-[#2C2C2C]/5"
              >
                <Upload className="w-12 h-12 text-[#2C2C2C]/40 mb-2" />
                <span className="text-sm text-[#2C2C2C]/60">클릭하여 이미지 업로드</span>
              </label>
            </div>
          )}
          {errors.imageFile && <p className="text-red-600 text-sm mt-2">{errors.imageFile}</p>}
        </div>

        {/* 전시 제목 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            전시 제목 <span className="text-[#C84630]">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.title ? 'border-red-600' : 'border-[#2C2C2C]/20'
            } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
            placeholder="전시 제목을 입력하세요"
          />
          {errors.title && <p className="text-red-600 text-sm mt-2">{errors.title}</p>}
        </div>

        {/* 전시 유형 */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            전시 유형 <span className="text-[#C84630]">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-[#2C2C2C]/20 focus:border-[#C84630] focus:outline-none text-[#2C2C2C]"
          >
            {EXHIBITION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 전시 기간 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              전시 시작일 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.startDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
            />
            {errors.startDate && <p className="text-red-600 text-sm mt-2">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              전시 종료일 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.endDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
            />
            {errors.endDate && <p className="text-red-600 text-sm mt-2">{errors.endDate}</p>}
          </div>
        </div>

        {/* 전시 장소 */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            전시 장소 <span className="text-[#C84630]">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.location ? 'border-red-600' : 'border-[#2C2C2C]/20'
            } focus:border-[#C84630] focus:outline-none text-[#2C2C2C]`}
            placeholder="예: 야송미술관 제1전시실"
          />
          {errors.location && <p className="text-red-600 text-sm mt-2">{errors.location}</p>}
        </div>

        {/* 전시 설명 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            전시 설명 <span className="text-[#C84630]">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.description ? 'border-red-600' : 'border-[#2C2C2C]/20'
            } focus:border-[#C84630] focus:outline-none text-[#2C2C2C] resize-none`}
            placeholder="전시에 대한 설명을 입력하세요"
          />
          {errors.description && <p className="text-red-600 text-sm mt-2">{errors.description}</p>}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => onCancel()}
            className="flex-1 px-6 py-3 bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 transition-colors rounded-lg text-[#2C2C2C] font-medium"
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

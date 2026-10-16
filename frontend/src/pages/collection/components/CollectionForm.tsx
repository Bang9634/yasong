import { Upload, X } from 'lucide-react';
import type { useCollectionEditor } from '../hooks/useCollectionEditor';

type CollectionFormProps = Pick<
  ReturnType<typeof useCollectionEditor>,
  | 'handleSubmit'
  | 'imagePreview'
  | 'setImageFile'
  | 'setImagePreview'
  | 'handleImageChange'
  | 'artist'
  | 'setArtist'
  | 'title'
  | 'setTitle'
  | 'year'
  | 'setYear'
  | 'size'
  | 'setSize'
  | 'description'
  | 'setDescription'
  | 'isPinned'
  | 'setIsPinned'
  | 'loading'
> & {
  onCancel: () => void;
  isEditing: boolean;
};

export function CollectionForm({
  handleSubmit,
  imagePreview,
  setImageFile,
  setImagePreview,
  handleImageChange,
  artist,
  setArtist,
  title,
  setTitle,
  year,
  setYear,
  size,
  setSize,
  description,
  setDescription,
  isPinned,
  setIsPinned,
  onCancel,
  loading,
  isEditing,
}: CollectionFormProps) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 이미지 업로드 섹션 */}
        <div className="bg-[#F4F4F0]/5 rounded-lg p-6 border border-[#F4F4F0]/20">
          <label className="block text-[#F4F4F0] font-medium mb-4 text-lg">작품 이미지</label>

          {/* 이미지 미리보기 */}
          {imagePreview ? (
            <div className="relative mb-4">
              <img
                src={imagePreview}
                alt="미리보기"
                className="max-h-96 mx-auto object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#F4F4F0]/30 rounded-lg p-12 text-center mb-4">
              <Upload className="w-16 h-16 text-[#F4F4F0]/40 mx-auto mb-4" />
              <p className="text-[#F4F4F0]/60 mb-2">이미지를 선택해주세요</p>
              <p className="text-[#F4F4F0]/40 text-sm">JPG, PNG (최대 10MB)</p>
            </div>
          )}

          {/* 이미지 업로드 버튼 */}
          <label className="block">
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <div className="px-6 py-3 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors cursor-pointer text-center font-medium">
              <Upload className="w-5 h-5 inline-block mr-2" />
              {imagePreview ? '다른 이미지 선택' : '이미지 업로드'}
            </div>
          </label>
        </div>

        {/* 기본 정보 (2x2 그리드) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 작가 */}
          <div className="flex items-center gap-3">
            <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">작가</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
              placeholder="작가명을 입력하세요"
              required
            />
          </div>

          {/* 작품명 */}
          <div className="flex items-center gap-3">
            <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">작품명</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
              placeholder="작품명을 입력하세요"
              required
            />
          </div>

          {/* 제작년도 */}
          <div className="flex items-center gap-3">
            <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">제작년도</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
              placeholder="예: 1980, 1980년, 1980-1981"
              required
            />
          </div>

          {/* 크기 */}
          <div className="flex items-center gap-3">
            <label className="text-[#F4F4F0] font-medium whitespace-nowrap w-20">크기</label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0]"
              placeholder="예: 45.5 x 53.0 cm"
              required
            />
          </div>
        </div>

        {/* 작품 설명 */}
        <div>
          <label className="block text-[#F4F4F0] font-medium mb-2">작품 설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={18}
            className="w-full px-4 py-3 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0] resize-none"
            placeholder="작품에 대한 설명을 입력하세요"
            required
          />
        </div>

        {/* 대표 작품 설정 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPinned"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="w-5 h-5 rounded border-[#F4F4F0]/20 bg-[#F4F4F0]/10 text-[#C84630] focus:ring-[#C84630]"
          />
          <label htmlFor="isPinned" className="text-[#F4F4F0] font-medium cursor-pointer">
            대표 작품으로 설정 (홈페이지에 표시)
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-[#F4F4F0]/10 text-[#F4F4F0] rounded-lg hover:bg-[#F4F4F0]/20 transition-colors font-medium border border-[#F4F4F0]/30"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '저장 중...' : isEditing ? '수정 완료' : '추가 완료'}
          </button>
        </div>
      </form>
    </>
  );
}

import type { useLegalTermEditor } from '../hooks/useLegalTermEditor';

type LegalTermFormProps = Pick<
  ReturnType<typeof useLegalTermEditor>,
  'handleSubmit' | 'formData' | 'handleInputChange' | 'errors' | 'isLoading'
> & {
  isEditMode: boolean;
  onCancel: () => void;
};

export function LegalTermForm({
  handleSubmit,
  formData,
  handleInputChange,
  isEditMode,
  errors,
  onCancel,
  isLoading,
}: LegalTermFormProps) {
  const getTypeDisplayName = (type: string) => {
    return type === 'TERMS_OF_SERVICE' ? '이용약관' : '개인정보 처리방침';
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg p-8 shadow-sm">
        {/* 약관 타입 */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            약관 타입 <span className="text-[#C84630]">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            disabled={isEditMode}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.type ? 'border-red-600' : 'border-[#2C2C2C]/20'
            } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C] ${
              isEditMode ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <option value="TERMS_OF_SERVICE">이용약관</option>
            <option value="PRIVACY_POLICY">개인정보 처리방침</option>
          </select>
          {isEditMode && (
            <p className="text-sm text-[#2C2C2C]/60 mt-2">약관 타입은 수정할 수 없습니다.</p>
          )}
        </div>

        {/* 버전 */}
        <div>
          <label htmlFor="version" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            버전 <span className="text-[#C84630]">*</span>
          </label>
          <input
            type="text"
            id="version"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.version ? 'border-red-600' : 'border-[#2C2C2C]/20'
            } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C]`}
            placeholder="예: 1.0, 2.1, 2024.01.01"
          />
          {errors.version && <p className="text-red-600 text-sm mt-2">{errors.version}</p>}
        </div>

        {/* 시행일 & 종료일 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              시행일 <span className="text-[#C84630]">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.startDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C]`}
            />
            {errors.startDate && <p className="text-red-600 text-sm mt-2">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              종료일 (선택사항)
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.endDate ? 'border-red-600' : 'border-[#2C2C2C]/20'
              } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C]`}
            />
            {errors.endDate && <p className="text-red-600 text-sm mt-2">{errors.endDate}</p>}
            <p className="text-sm text-[#2C2C2C]/60 mt-2">비워두면 무기한입니다.</p>
          </div>
        </div>

        {/* 내용 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            약관 내용 <span className="text-[#C84630]">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={20}
            className={`w-full px-4 py-3 rounded-lg border-2 ${
              errors.content ? 'border-red-600' : 'border-[#2C2C2C]/20'
            } focus:border-[#C84630] focus:outline-none bg-white text-[#2C2C2C] resize-none font-mono text-sm`}
            placeholder="약관 내용을 입력하세요..."
          />
          {errors.content && <p className="text-red-600 text-sm mt-2">{errors.content}</p>}
          <p className="text-sm text-[#2C2C2C]/60 mt-2">
            {isEditMode ? '' : '새로운 약관을 추가하면 이전 약관은 자동으로 비활성화됩니다.'}
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 transition-colors rounded-lg text-[#2C2C2C] font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#C84630] hover:bg-[#A33520] transition-colors rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '저장 중...' : isEditMode ? '수정하기' : '등록하기'}
          </button>
        </div>
      </form>
    </>
  );
}

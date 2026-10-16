import { X } from 'lucide-react';
import type { useCollectionModal } from '../hooks/useCollectionModal';

type CollectionEditorModalProps = Pick<
  ReturnType<typeof useCollectionModal>,
  | 'isModalOpen'
  | 'isEditing'
  | 'closeModal'
  | 'handleSubmit'
  | 'title'
  | 'setTitle'
  | 'artist'
  | 'setArtist'
  | 'year'
  | 'setYear'
  | 'size'
  | 'setSize'
  | 'description'
  | 'setDescription'
  | 'handleImageChange'
  | 'imagePreview'
  | 'isPinned'
  | 'setIsPinned'
>;

export function CollectionEditorModal({
  isModalOpen,
  isEditing,
  closeModal,
  handleSubmit,
  title,
  setTitle,
  artist,
  setArtist,
  year,
  setYear,
  size,
  setSize,
  description,
  setDescription,
  handleImageChange,
  imagePreview,
  isPinned,
  setIsPinned,
}: CollectionEditorModalProps) {
  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#2C2C2C]">
                {isEditing ? '작품 수정' : '작품 추가'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작가 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제작년도 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                    placeholder="예: 1985"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    크기 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                    placeholder="예: 45.5 x 53cm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
                  required={!isEditing}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 text-[#C84630] border-gray-300 rounded focus:ring-[#C84630]"
                />
                <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700">
                  홈페이지 대표 작품으로 고정
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#C84630] text-white rounded-lg hover:bg-[#A83820] transition-colors"
                >
                  {isEditing ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

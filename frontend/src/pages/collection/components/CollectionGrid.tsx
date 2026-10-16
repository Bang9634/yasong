import { getFullImageUrl } from '@/utils/api';
import { Edit2, Trash2, Pin } from 'lucide-react';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import type { useCollectionsList } from '../hooks/useCollectionsList';

type CollectionGridProps = Pick<
  ReturnType<typeof useCollectionsList>,
  'loading' | 'collections' | 'visibleCards' | 'handleDelete'
> & {
  onOpen: (id: number) => void;
  onEdit: (id: number) => void;
  isAdmin: boolean | null;
};

export function CollectionGrid({
  loading,
  collections,
  visibleCards,
  onOpen,
  onEdit,
  isAdmin,
  handleDelete,
}: CollectionGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="text-[#F4F4F0] text-lg">로딩 중...</div>
          </div>
        ) : !collections || collections.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="text-[#F4F4F0]/60 text-lg">작품이 없습니다.</div>
          </div>
        ) : (
          collections.map((collection, index) => (
            <div
              key={collection.id}
              data-card-id={collection.id}
              className={`group transition-all duration-700 ${
                visibleCards.has(collection.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* 작품 이미지 */}
              <div
                className="relative overflow-hidden flex justify-center h-[300px] items-end mb-0 cursor-pointer"
                onClick={() => onOpen(collection.id)}
              >
                <ImageWithFallback
                  src={getFullImageUrl(collection.imageUrl)}
                  alt={collection.title}
                  className="w-[90%] max-h-full object-contain group-hover:opacity-90 transition-opacity duration-300"
                />
                {collection.isPinned && (
                  <div className="absolute top-2 right-2 bg-[#C84630] text-[#F4F4F0] px-3 py-1 rounded-full flex items-center text-xs">
                    <Pin className="w-3 h-3 mr-1" />
                    고정
                  </div>
                )}

                {/* 관리자 버튼 */}
                {isAdmin && (
                  <div className="absolute top-2 left-2 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(collection.id);
                      }}
                      className="w-8 h-8 bg-[#F4F4F0] text-[#2C2C2C] rounded-full hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(collection.id);
                      }}
                      className="w-8 h-8 bg-[#F4F4F0]/90 text-[#2C2C2C] rounded-full hover:bg-red-600 hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 구분선 */}
              <div className="w-full h-px bg-[#F4F4F0]/20 mb-4"></div>

              {/* 텍스트 정보 */}
              <div
                className="flex flex-col min-h-[180px] cursor-pointer"
                onClick={() => onOpen(collection.id)}
              >
                {/* 작가 */}
                <div className="text-xs text-[#F4F4F0]/60 font-medium mb-2">
                  {collection.artist}
                </div>

                {/* 제목 */}
                <h3 className="text-xl font-bold text-[#F4F4F0] group-hover:text-[#C84630] transition-colors line-clamp-2 mb-3">
                  {collection.title}
                </h3>

                {/* 설명 */}
                <p className="text-sm text-[#F4F4F0]/70 leading-relaxed line-clamp-3 mb-4">
                  {collection.description}
                </p>

                {/* 하단 고정 영역 */}
                <div className="mt-auto space-y-2">
                  {/* 제작 연도 및 크기 */}
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 bg-[#F4F4F0] text-[#2C2C2C] text-xs rounded-full">
                      {collection.year}
                    </span>
                    <span className="inline-block px-3 py-1 bg-[#F4F4F0]/20 text-[#F4F4F0] text-xs rounded-full">
                      {collection.size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

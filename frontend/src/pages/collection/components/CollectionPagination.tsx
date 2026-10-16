import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { useCollectionsList } from '../hooks/useCollectionsList';

type CollectionPaginationProps = Pick<
  ReturnType<typeof useCollectionsList>,
  'totalPages' | 'setCurrentPage' | 'currentPage' | 'pageInput' | 'setPageInput' | 'totalCount'
>;

export function CollectionPagination({
  totalPages,
  setCurrentPage,
  currentPage,
  pageInput,
  setPageInput,
  totalCount,
}: CollectionPaginationProps) {
  return (
    <>
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? 'pointer-events-none text-[#F4F4F0]/20'
                      : 'cursor-pointer text-[#F4F4F0] hover:text-[#C84630]'
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer ${currentPage === page ? 'bg-[#C84630] text-[#F4F4F0]' : 'text-[#F4F4F0] hover:text-[#C84630]'}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none text-[#F4F4F0]/20'
                      : 'cursor-pointer text-[#F4F4F0] hover:text-[#C84630]'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* 페이지 직접 입력 */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-[#F4F4F0]/70 text-sm">페이지 이동:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(pageInput);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                    setPageInput('');
                  }
                }
              }}
              placeholder={`1-${totalPages}`}
              className="w-20 px-3 py-2 bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg text-[#F4F4F0] text-center focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630]"
            />
            <button
              onClick={() => {
                const page = parseInt(pageInput);
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                  setPageInput('');
                }
              }}
              className="px-4 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors text-sm font-medium"
            >
              이동
            </button>
          </div>

          {/* 총 결과 개수 */}
          <div className="mt-4 text-center text-[#F4F4F0]/60 text-sm">총 {totalCount}개의 작품</div>
        </div>
      )}
    </>
  );
}

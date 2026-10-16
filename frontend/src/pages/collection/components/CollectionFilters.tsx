import { Search } from 'lucide-react';
import type { useCollectionsList } from '../hooks/useCollectionsList';

type CollectionFiltersProps = Pick<
  ReturnType<typeof useCollectionsList>,
  'searchQuery' | 'setSearchQuery' | 'setYearFilter' | 'yearFilter'
>;

export function CollectionFilters({
  searchQuery,
  setSearchQuery,
  setYearFilter,
  yearFilter,
}: CollectionFiltersProps) {
  return (
    <>
      <div className="mb-8">
        <div className="max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F4F4F0]/40 w-4 h-4" />
          <input
            type="text"
            placeholder="작품명, 작가, 제작년도로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F4F4F0]/10 border border-[#F4F4F0]/20 rounded-lg focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] text-[#F4F4F0] placeholder:text-[#F4F4F0]/40"
          />
        </div>
      </div>

      {/* 연도별 탭 */}
      <div className="mb-8 border-b border-[#F4F4F0]/20">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {[
            '전체',
            '1980년 이전',
            '1980-1989년',
            '1990-1994년',
            '1995-1999년',
            '2000-2004년',
            '2005-2019년',
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setYearFilter(tab)}
              className={`
                    pb-3 px-2 font-medium transition-all whitespace-nowrap relative
                    ${
                      yearFilter === tab
                        ? 'text-[#C84630]'
                        : 'text-[#F4F4F0]/60 hover:text-[#F4F4F0]'
                    }
                  `}
            >
              {tab}
              {yearFilter === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C84630]"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
